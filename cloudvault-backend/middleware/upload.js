const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/tmp'); // ✅ writable in Render
  },
  
});