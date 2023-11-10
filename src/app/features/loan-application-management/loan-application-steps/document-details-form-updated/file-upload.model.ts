export interface FileUpload {}

/**
 * Defines the structure of a document file model.
 */
export interface DocFileModel {
  docType: string; // The type of the document (e.g. "PDF", "Word", etc.)
  docPath: string; // The path to the document on the server
  docName: string;
  docDescription: string; // A brief description of the document
  docFile?: File; // An optional property that holds the File object for the document
  id: number; // A unique identifier for the document file
  applicationId?: string; // An optional property that specifies an application ID associated with the document

  individualId?: any; // Unique Identifier for which individual document belongs to
}

// Define an interface called `DocumentType`.
export interface DocumentUploadControlData {
  // Define a property `name` of type string within the interface.
  name: string;
  // Define a property `formControlName` of type string within the interface.
  formControlName: string;
  // Define a property `required` of type boolean within the interface.
  required: boolean;
  // Define a property `multiple` of type boolean within the interface.
  multiple: boolean;

  maxFileCount: number;
  // Define a property `type` of type string within the interface.
  type: string;
  // Define a property `minSize` of type number within the interface.
  minSize: number;
  // Define a property `maxSize` of type number within the interface.
  maxSize: number;

  accept: string;

  data: DocFileModel[] | DocFileModel | null;

  additionalInformation?: string;

  longDescription?: string;

  individualId?: any;
}
