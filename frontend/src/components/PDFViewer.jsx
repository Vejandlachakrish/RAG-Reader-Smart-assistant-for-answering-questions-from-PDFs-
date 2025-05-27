const PDFViewer = ({ fileUrl }) => {
  return (
    <div className="my-4">
      <iframe
        src={fileUrl}
        title="PDF Viewer"
        width="100%"
        height="600px"
        className="border rounded"
      ></iframe>
    </div>
  );
};

export default PDFViewer;
