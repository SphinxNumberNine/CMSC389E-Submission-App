const fs = require("fs");
const unzipper = require("unzipper");

module.exports = app => {
  app.post("/upload", (req, res) => {
    let files = req.files;

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    const uploadedFileName = files[Object.keys(files)[0]].name.replace(
      ".zip",
      ""
    );
    const storedFileName = "input/" + uploadedFileName + ".zip";

    fs.writeFile(storedFileName, files[Object.keys(files)[0]].data, err => {
      if (err) {
        return res.status(400).send({
          err,
          message: "FAILED"
        });
      }

      fs.createReadStream(storedFileName)
        .pipe(unzipper.Extract({ path: "output/" + uploadedFileName }))
        .on("close", () => {
          res.status(200).send({ message: "SUCCESS" });
        });
    });
  });
};
