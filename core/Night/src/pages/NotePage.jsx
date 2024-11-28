import { useEffect, useState } from "react";
import { BiSolidTrashAlt } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FormatDate } from "../../components/FormatDate";
import Modal from "../../components/Modal";
import "./NotePage.css";

const NoteDetailPage = ({ deleteNote }) => {
  const [note, setNote] = useState({});
  const { slug } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

 
  const handleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/notes/${slug}`)
      .then((res) => {
        setNote(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching note:", err.message);
        setLoading(false);
      });
  }, [slug]);

 
  const handleDelete = () => {
    deleteNote(slug); 
    navigate("/"); 
  };

  if (loading) {
    return <p>Loading note...</p>;
  }

  return (
    <>
      <div className="note-container">
        <h3 className="title">{note.title}</h3>
        <span className="d-flex justify-content-center">
          <p className="note-date font-12 text-muted me-5">
            created: {FormatDate(note.created)}
          </p>
          <p className="note-date font-12 text-muted me-5">
            last updated: {FormatDate(note.updated)}
          </p>
        </span>
        <span className="button-group">
          <Link to={`/edit-note/${slug}`}>
            <button className="btn btn-primary">
              <FiEdit />
              <span>Edit</span>
            </button>
          </Link>

          <button className="btn btn-danger" onClick={handleIsOpen}>
            <BiSolidTrashAlt />
            <span>Delete</span>
          </button>
        </span>
        <p className="description">{note.body}</p>
      </div>

      {isOpen && (
        <Modal
          handleIsOpen={handleIsOpen}
          deleteNote={handleDelete} 
        />
      )}
    </>
  );
};

export default NoteDetailPage;
