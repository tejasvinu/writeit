import mongoose from 'mongoose';
import { DocumentType, DocumentStatus } from '@/types/Document';

// Add metadata sub-schema without strict enum validation
const documentMetadataSchema = new mongoose.Schema({
  type: { 
    type: String,
    default: 'note'
    // Removed strict enum validation as it's causing issues with 'folder'
  },
  wordCount: Number,
  status: { 
    type: String, 
    default: 'draft'
  },
  synopsis: String,
  characters: [String],
  location: String,
  timeline: String
}, { _id: false });

export interface IDocument {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  isFolder: boolean;
  path: string;
  parent?: mongoose.Types.ObjectId | null;
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    type?: DocumentType;
    wordCount?: number;
    status?: DocumentStatus;
    synopsis?: string;
    characters?: string[];
    location?: string;
    timeline?: string;
  };
}

// Add static methods to interface
interface DocumentModel extends mongoose.Model<IDocument> {
  getChildren(ownerId: string, parentPath: string): Promise<IDocument[]>;
  getAncestors(ownerId: string, path: string): Promise<IDocument[]>;
  moveDocument(ownerId: string, documentId: string, newParentPath: string): Promise<mongoose.mongo.BulkWriteResult>;
}

const documentSchema = new mongoose.Schema<IDocument>({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  content: {
    type: String,
    default: '',
    // Don't trim content to preserve whitespace
  },
  isFolder: {
    type: Boolean,
    default: false,
  },
  path: {
    type: String,
    required: [true, 'Path is required'],
    default: '/root',
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    default: null,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a document owner'],
  },
  metadata: {
    type: documentMetadataSchema,
    default: () => ({})
  }
}, {
  timestamps: true,
});

// Add indexes for better query performance
documentSchema.index({ owner: 1, path: 1 });
documentSchema.index({ path: 1 });
documentSchema.index({ title: 1, owner: 1 });
documentSchema.index({ owner: 1, parent: 1 });

// Pre-save middleware to ensure proper document setup
documentSchema.pre('save', async function(next) {
  // Ensure content is string
  if (this.content === undefined) {
    this.content = '';
  }
  if (typeof this.content !== 'string') {
    this.content = String(this.content);
  }
  
  // Ensure metadata exists
  if (!this.metadata) {
    this.metadata = {};
  }
  
  // For folders, explicitly set the type to 'folder'
  if (this.isFolder === true) {
    this.metadata.type = 'folder';
  }
  
  // For non-folders, ensure a type is set
  if (!this.isFolder && !this.metadata.type) {
    this.metadata.type = 'note'; // Default for documents
  }

  // Handle path generation if parent exists
  if (this.parent) {
    const parentDoc = await mongoose.model('Document').findById(this.parent);
    if (parentDoc) {
      this.path = `${parentDoc.path}/${this.title}`;
    }
  } else if (this.path === '/root') {
    this.path = `/root/${this.title}`;
  }

  next();
});

// Static methods for hierarchical operations
documentSchema.statics.getChildren = function(ownerId: string, parentPath: string) {
  return this.find({
    owner: ownerId,
    path: new RegExp(`^${parentPath}/[^/]+$`)
  }).sort({ isFolder: -1, title: 1 });
};

documentSchema.statics.getAncestors = function(ownerId: string, path: string) {
  const ancestorPaths = path
    .split('/')
    .slice(1, -1)
    .reduce((paths: string[], _, index, arr) => {
      paths.push('/' + arr.slice(0, index + 1).join('/'));
      return paths;
    }, []);

  return this.find({
    owner: ownerId,
    path: { $in: ancestorPaths }
  }).sort({ path: 1 });
};

documentSchema.statics.moveDocument = async function(
  ownerId: string,
  documentId: string,
  newParentPath: string
) {
  const doc = await this.findOne({ _id: documentId, owner: ownerId });
  if (!doc) return null;

  const oldPath = doc.path;
  const newPath = `${newParentPath}/${doc.title}`;

  // Update the document and all its descendants
  const descendantDocs = await this.find({
    owner: ownerId,
    path: new RegExp(`^${oldPath}/`)
  });

  const bulkOps = descendantDocs.map((desc: IDocument) => ({
    updateOne: {
      filter: { _id: desc._id },
      update: {
        $set: {
          path: desc.path.replace(oldPath, newPath)
        }
      }
    }
  }));

  // Update the target document
  bulkOps.push({
    updateOne: {
      filter: { _id: documentId },
      update: {
        $set: {
          path: newPath
        }
      }
    }
  });

  return this.bulkWrite(bulkOps);
};

export const Document = (mongoose.models.Document || mongoose.model<IDocument, DocumentModel>('Document', documentSchema)) as DocumentModel;