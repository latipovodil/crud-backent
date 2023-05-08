const express = require("express");
const app = express();
const todos = require("./todos.json");
const { writeFile } = require("fs");
const cors = require("cors")
const port = 3000;

console.log(__dirname);

app.use(cors());  
app.use(express.json());
app.get("/:id", (req, res) => {
  todos.length > 0
    ? todos.map((el) => {
        if (el.id == req.params.id) {
          res.json(el);
        } else {
          res.json({
            error: true,
            message: "Bu id dagi todo yo'q",
          });
        }
      })
    : res.json({
        error: true,
        message: "Hozircha bizda bironta todo yo'q",
      });
});
app.get("/", (req, res) => {
  res.json(todos);
});
app.post("/add", (req, res) => {
  const id = Math.round(Math.random() * 10000000) 
  if (req.body.name) {
    writeFile(
      "todos.json",
      JSON.stringify(
        [...todos, { ...req.body, id:id }],
        null,
        4
      ),
      (err) => {
        err ? console.log(err) : "";
      }
    );

    res.json({
      error: false,
      message: "Muvaffaqqiyatli qo'shildi",
      data: {
        name: req.body.name,
        id: id,
      },
    });
  } else {
    res.json({
      error: true,
      message: "Har qanday holatda ham name jo'natilishi shart",
    });
  }
});

app.put("/edit", (req, res) => {
  let succes = false;
  todos?.map((el) => {
    if (el.id == req.body.id) {
      res.json({
        error: false,
        message: "Data yangilandi",
      });
      succes = true;
    }
  });

  console.log(succes);

  if (succes) {
    console.log(req.body);

    writeFile(
      "todos.json",
      JSON.stringify(
        todos.map((el) => {
          if (el.id == req.body.id) {
            return req.body;
          }
          return el;
        }),
        null,
        4
      ),
      (err) => {
        err ? console.log(err) : "";
      }
    );
  } else {
    res.json({
      error: true,
      message: "Bunaqa id dagi todo yo'q",
    });
  }
});

app.use("/delete", (req, res) => {
  if (req.body.id) {
    todos.map((el) => {
      if (el.id == req.body.id) {
        res.json({
          error: false,
          message: "Todo delete qilindi",
        });

        writeFile(
          "todos.json",
          JSON.stringify(
            todos.filter((el) => el.id != req.body.id),
            null,
            4
          ),
          (err) => {
            err ? console.log(err) : "";
          }
        );
      }
    });
  } else {
    res.json({
      error: true,
      message: "Id jo'nating",
    });
  }
});

app.listen(port, () => {
  console.log(`Server run in ${port}`);
  console.log("Powered by Odilbek");
});
