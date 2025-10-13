// Message types for communication between UI and plugin code
export interface ImportMessage {
  type: 'import';
  collectionMode: 'new' | 'existing';
  collectionName?: string;
  collectionId?: string;
  selectedColors: string[];
  variants: {
    light: boolean;
    lightAlpha: boolean;
    dark: boolean;
    darkAlpha: boolean;
  };
}

export interface GetCollectionsMessage {
  type: 'get-collections';
}

export interface CollectionsResponseMessage {
  type: 'collections-response';
  collections: Array<{
    id: string;
    name: string;
  }>;
}

export type PluginMessage = ImportMessage | GetCollectionsMessage;
export type UIMessage = CollectionsResponseMessage;

// Radix color metadata
export interface RadixColorInfo {
  name: string;
  displayName: string;
  category: string;
  previewColor: string;
}
