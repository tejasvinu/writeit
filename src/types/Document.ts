export type ViewMode = 'list' | 'grid'
export type SortOption = 'name' | 'updatedAt' | 'createdAt' | 'wordCount'

export type DocumentStatus = 'draft' | 'revision' | 'final'
export type DocumentType = 'chapter' | 'scene' | 'note' | 'character' | 'plotline' | 'folder'

export interface DocumentMetadata {
  type: DocumentType;
  wordCount: number;
  status: DocumentStatus;
  synopsis?: string;
  characters?: string[];
  location?: string;
  timeline?: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  path: string;
  createdAt: Date;
  updatedAt: Date;
  parent: string | null;
  metadata: DocumentMetadata;
}

export interface IDocument {
  _id: string;
  title: string;
  content: string;
  isFolder: boolean;
  path: string;
  parent: string | null;
  owner: string;
  createdAt: string;
  updatedAt: string;
  metadata: DocumentMetadata;
}

export interface ICreateDocument {
  title: string;
  content?: string;
  isFolder?: boolean;
  parent?: string | null;
  parentPath?: string;
}

export interface IUpdateDocument {
  title?: string;
  content?: string;
  newParentPath?: string;
  metadata?: Partial<DocumentMetadata>;
}

export type DocumentView = 'grid' | 'list'