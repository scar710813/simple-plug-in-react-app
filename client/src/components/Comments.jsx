/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";
import { useTranslation } from "react-i18next";
import ErrorDiv from "./ErrorDiv";

// eslint-disable-next-line react/prop-types
const Comments = ({ url, auth }) => {
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const loaded = useRef(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (loaded.current === false) {
      setLoading(true);
      axios({
        method: "post",
        url: process.env.REACT_APP_API_SERVER + "/api/getcomments",
        data: {
          url,
          authKey: auth.authKey,
        },
      }).then((res) => {
        setLoading(false);

        if (res.data.meta) {
          setComments(res.data.meta);
          setCount(res.data.page.count);
          setError("");
        } else {
          setError(res.data.error);
        }
      });

      loaded.current = true;
    }
  }, []);

  return (
    <div>
      <div className="mt-5 ml-8 inline-flex items-center bg-white leading-none rounded-full p-1 shadow text-teal text-sm">
        <span className="inline-flex bg-gray-700 text-white rounded-full h-6 px-3 justify-center items-center">
          {t("Page")}
        </span>
        {/* <span className="inline-flex px-2 text-gray-700">{url}</span> */}
        <span className="inline-flex px-2 text-gray-700">
          {count} {count > 1 ? t("comments") : t("comment")}
        </span>
      </div>

      {loading && (
        <div className="px-4 py-5 border-b rounded-t sm:px-6">
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <div className="inline-flex items-center bg-white leading-none  rounded-full p-2 shadow text-teal text-sm">
              <span className="inline-flex px-2 text-gray-700">
                {t("Loading...")}
              </span>
            </div>
          </div>
        </div>
      )}

      {error && <ErrorDiv error={error} />}

      <CommentsList
        comments={comments}
        auth={auth}
        setComments={setComments}
        url={url}
        setCount={setCount}
        t={t}
      />

      <CommentForm
        auth={auth}
        setComments={setComments}
        url={url}
        t={t}
        setCount={setCount}
      />
    </div>
  );
};

export default Comments;
