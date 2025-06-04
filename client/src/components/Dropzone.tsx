import { Loader, Paperclip, TrashIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

function ResumeDropzone({
  uploadFile,
  text,
  styles = "py-4",
  removeFile,

  loading,
  loading_text = "Uploading your file...",
}: {
  uploadFile: (e: any) => void;
  text: string | null;
  styles?: string;
  removeFile?: (e: any) => void;
  resume_id?: string;
  loading?: boolean;
  loading_text?: string;
}) {
  const [upload_file_error, setUploadFileError] = useState("");
  const [is_hovered, setIsHovered] = useState(false);

  const showing_delete_button = is_hovered && removeFile && text && !loading;

  const onDrop = useCallback((acceptedFiles: any, rejectedFiles: any) => {
    if (rejectedFiles.length > 1) {
      setUploadFileError("Only one file is allowed");
      return;
    } else if (
      rejectedFiles.length === 1 &&
      rejectedFiles[0].errors[0]?.code === "file-invalid-type"
    ) {
      setUploadFileError("Invalid file type - only PDFs are allowed");
      return;
    } else if (
      rejectedFiles.length === 1 &&
      rejectedFiles[0].errors[0]?.code === "file-too-large"
    ) {
      setUploadFileError("Max file size is 10 MB");
      return;
    } else if (rejectedFiles.length === 1) {
      setUploadFileError(
        rejectedFiles[0].errors[0]?.message || "Error, invalid file"
      );
      return;
    }

    setUploadFileError("");

    uploadFile({
      target: {
        files: acceptedFiles,
      },
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
      "text/plain": [],
    },
    multiple: false,
    maxSize: 10485760, // 10MB
  });

  return (
    <div className="flex flex-col mx-auto">
      <div
        className="mx-auto w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {showing_delete_button ? (
          <div
            className={`mt-2 mx-auto ml-1 mr-1 flex cursor-pointer items-center rounded-md text-center shadow-sm outline-dotted outline-neutral-400 hover:bg-neutral-200 ${
              isDragActive ? "bg-neutral-200" : "bg-neutral-100"
            } ${styles} whitespace-nowrap`}
            onClick={removeFile}
          >
            <TrashIcon className="ml-auto mr-2 w-4" size="1x" />
            <div className="mr-auto text-base">Remove</div>
          </div>
        ) : loading ? (
          <div
            className={`mt-2 opacity-50 mx-auto ml-1 mr-1 flex cursor-not-allowed items-center rounded-md text-center shadow-sm outline-dotted outline-neutral-400 ${
              isDragActive ? "bg-neutral-200" : "bg-neutral-100"
            } ${styles} whitespace-nowrap filter blur-[0.5px]`}
          >
            <Loader className="ml-auto mr-2 w-4 animate-spin" size="1x" />
            <div className="mr-auto text-base">{loading_text}</div>
          </div>
        ) : (
          <div
            {...getRootProps({
              className: `mt-2 mx-auto ml-1 mr-1 flex cursor-pointer items-center rounded-md text-center shadow-sm outline-dotted outline-neutral-400 hover:bg-neutral-200 ${
                isDragActive ? "bg-neutral-200" : "bg-neutral-100"
              } ${styles} whitespace-nowrap`,
            })}
          >
            <Paperclip className="ml-auto mr-2 w-4" size="1x" />
            <div className="mr-auto text-base">
              {text ||
                (isDragActive
                  ? "Drop resume here"
                  : "Drag & drop or browse (PDF)")}
            </div>
            <input
              {...getInputProps({
                className: "hidden",
              })}
            />
          </div>
        )}

        <div className="mt-2 text-base font-light text-red-500">
          {upload_file_error}
        </div>
      </div>
    </div>
  );
}

export default ResumeDropzone;
