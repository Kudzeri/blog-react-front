import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import { useSelector } from "react-redux";
import { isAuthSelector } from "../../redux/slices/auth";
import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";

export const AddPost = () => {
  const { postSlug } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(isAuthSelector);
  const [isLoading, setIsLoading] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [text, setText] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const inputFileRef = React.useRef("");
  const isEdditing = Boolean(postSlug);

  const handleChangeFile = async (e) => {
    try {
      const formData = new FormData();
      const file = e.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
    } catch (err) {
      console.warn(err);
      alert("Не удалось загрузить файл");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  React.useEffect(() => {
    if (postSlug) {
      axios
        .get(`/posts/${postSlug}`)
        .then(({ data }) => {
          setTitle(data.title);
          setSlug(data.slug);
          setText(data.text);
          setImageUrl(data.imageUrl);
          setTags(data.tags.join(","));
        })
        .catch((err) => {
          console.warn(err);
          alert("Не удалось получить статью");
        });
    }
  }, [postSlug]);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const formattedTags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      const fields = {
        title,
        slug,
        imageUrl,
        tags: formattedTags,
        text,
      };

      const { data } = isEdditing
        ? await axios.patch(`/posts/${postSlug}`, fields)
        : await axios.post("/posts", fields);

      navigate(`/posts/${data.slug}`);
    } catch (err) {
      console.warn(err);
      alert(
        isEdditing ? "Не удалось обновить пост" : "Не удалось создать пост"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
        Загрузить превью
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        accept="image/*"
        onChange={handleChangeFile}
        hidden
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>

          <img
            className={styles.image}
            src={`https://blog-nodejs-api.onrender.com${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Slug (url)"
        value={slug}
        onChange={(e) => {
          setSlug(e.target.value);
        }}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги (через запятую)"
        value={tags}
        onChange={(e) => {
          setTags(e.target.value);
        }}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEdditing ? "Сохранить" : "Опубликовать"}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
