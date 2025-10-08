// @/app/@right/(_service)/(_context)/dialogs/types.ts

export type DialogType = 
  | "create"     
  | "edit"       
  | "confirm"   
  | "alert"      
  | "custom"
  | "delete";

export type InputType = 
  | "input" 
  | "textarea" 
  | "keywords" 
  | "images"
  | "knowledge-base"; // NEW: Knowledge Base type

export interface PageImages {
  id: string;
  alt?: string;
  href?: string;
}

/**
 * NEW: Knowledge Base specific data structure
 * Used to configure and track the state of knowledge base dialogs
 */
export interface KnowledgeBaseData {
  knowledgeType: "internal" | "external"; // Type of knowledge base
  pageData: {
    title: string;
    description: string;
    keywords: string[];
  };
  initialValue?: string; // Existing content for edit mode
  showInfoButton?: boolean; // Show "Information Does Not Exist" button
}

export type DialogState =
  | {
      open: true;
      type: DialogType;
      inputType?: InputType;
      title: string;
      description?: string;
      value?: string;
      keywords?: string[];
      images?: PageImages[];
      knowledgeBase?: KnowledgeBaseData; // NEW: Knowledge Base data
      placeholder?: string;
      onConfirm?: (value?: string, keywords?: string[], images?: PageImages[]) => void;
      onCancel?: () => void;
      confirmLabel?: string;
      cancelLabel?: string;
      confirmLoading?: boolean;
    }
  | { open: false };

export interface DialogShowOptions {
  type: DialogType;
  inputType?: InputType;
  title: string;
  description?: string;
  value?: string;
  keywords?: string[];
  images?: PageImages[];
  knowledgeBase?: KnowledgeBaseData; // NEW: Knowledge Base data
  placeholder?: string;
  onConfirm?: (value?: string, keywords?: string[], images?: PageImages[]) => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmLoading?: boolean;
}

export interface DialogsContextValue {
  show: (options: DialogShowOptions) => void;
  close: () => void;
  state: DialogState;
}
