import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";

interface IUploaderProps {
  handleChangeImages: (file: FileList) => void;
}
export default function Uploader(props: IUploaderProps) {
  const {handleChangeImages} = props

  const handleChangeStatus = (...rest: any) => {
    const [_, status, files] = rest
    if(status == "preparing") return
    handleChangeImages(files)
  };

  return (
    <div>
      <Dropzone
        accept="image/*"
        inputContent={(files, extra) => (extra.reject ? 'Image files only' : 'Upload images')}
        inputWithFilesContent={"Add more"}
        onChangeStatus={handleChangeStatus}
        styles={{
          dropzone: { minHeight: 100, maxHeight: 300, borderStyle: "dashed", color: "black" },
          dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },
          inputLabel: (files, extra) => (extra.reject ? { color: 'red' } : {}),
        }}
      />
    </div>
  );
}