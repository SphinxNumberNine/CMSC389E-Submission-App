const fs = require("fs");
const unzipper = require("unzipper");
const LineByLine = require("n-readlines");
const childProcess = require("child_process");
const axios = require("axios");
const constants = require("../constants");

module.exports = app => {
  app.post("/upload", async (req, res) => {
    let files = req.files;
    let uname = req.body.uname;
    let password = req.body.password;

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    const uploadedFileName = files[Object.keys(files)[0]].name.replace(
      ".zip",
      ""
    );
    const storedFileName = "input/" + uploadedFileName + ".zip";

    const projectNumber = uploadedFileName.slice(-1);

    const submitFileResponse = await axios.get(
      constants.projectsUrl + "/proj" + projectNumber + "submit"
    );

    const submitFileData = submitFileResponse.data;

    fs.writeFile(storedFileName, files[Object.keys(files)[0]].data, err => {
      if (err) {
        return res.status(400).send({
          err,
          message: "FAILED"
        });
      }

      const outputPath = "output/";

      fs.createReadStream(storedFileName)
        .pipe(unzipper.Extract({ path: outputPath }))
        .on("close", () => {
          const resultsLocation =
            "output/" + uploadedFileName + "/test_logs.txt";
          const liner = new LineByLine(resultsLocation);

          let resultsFileText = "";

          for (let i = 0; i < 4; i++) {
            //getting rid of the first 4 lines of text, which are largely junk
            liner.next();
          }

          let line = "_"; //initial setting of line to exist
          while (line == "" || (line && line != "Testing complete.")) {
            const inLine = liner.next().toString();
            let outLine = liner.next().toString();
            let expectedLine = liner.next().toString();

            outLine = outLine.replace("Out:", "");
            outLine = outLine.trim();

            expectedLine = expectedLine.replace("Result:", "");
            expectedLine = expectedLine.trim();

            resultsFileText += outLine + "\n";
            resultsFileText += expectedLine + "\n";
            resultsFileText += "--\n";

            line = liner.next().toString();
          }

          // makes sure data directory exists
          fs.mkdirSync("data/" + uname + "/proj" + projectNumber, {
            recursive: true
          });

          const resultsFilePath =
            "data/" + uname + "/proj" + projectNumber + "/results.txt";

          const submitFilePath =
            "data/" + uname + "/proj" + projectNumber + "/.submit";

          try {
            const resultsFileWrite = fs.writeFileSync(
              resultsFilePath,
              resultsFileText
            );
            const submitJarCopy = fs.copyFileSync(
              "assets/recompiledsubmit.jar",
              "data/" +
                uname +
                "/proj" +
                projectNumber +
                "/recompiledsubmit.jar"
            );
            const submitFileWrite = fs.writeFileSync(
              submitFilePath,
              submitFileData
            );
            let submitCommand =
              "java -jar " + "./recompiledsubmit.jar " + uname + " " + password;
            let execPath = "data/" + uname + "/proj" + projectNumber;
            let submitProcess = childProcess.exec(
              submitCommand,
              { cwd: execPath },
              (err, stdout, stderr) => {
                if (err) {
                  return res.status(500).send({ message: err });
                }

                return res.status(200).send({ message: stdout });
              }
            );
          } catch (err) {
            console.log(err);
            return res
              .status(500)
              .send({ message: "Writing Results to File Failed" });
          }
        });
    });
  });
};
