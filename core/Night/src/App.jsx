import { useState, useEffect } from "react";
import MainLayout from "./layout/MainLayouts";
import AddNotePage from "./pages/AddNotes";
import EditNotePage from "./pages/EditNotePage";
import HomePage from "./pages/HomePage";
import NoteDetailPage from "./pages/NotePage";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterText, setFilterText] = useState("");

  const handleFilterText = (val) => {
    setFilterText(val);
  };

  const handelSearchText = (val) => {
    setSearchText(val);
  };

  const filteredNotes =
    filterText === "BUSINESS"
      ? notes.filter((note) => note.category === "BUSINESS")
      : filterText === "PERSONAL"
      ? notes.filter((note) => note.category === "PERSONAL")
      : filterText === "IMPORTANT"
      ? notes.filter((note) => note.category === "IMPORTANT")
      : notes;

  useEffect(() => {
    if (searchText.length < 3) {
      setNotes([]);
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/notes-search/?search=${searchText}`)
      .then((res) => {
        setNotes(res.data);
      })
      .catch((err) => console.log(err.message));
  }, [searchText]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://127.0.0.1:8000/notes/")
      .then((res) => {
        setNotes(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const addNote = (data) => {
    axios
      .post("http://127.0.0.1:8000/notes/", data)
      .then((res) => {
        setNotes([...notes, data]);
        toast.success("A new note has been added");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const updateNote = (data, slug) => {
    axios
      .put(`http://127.0.0.1:8000/notes/${slug}/`, data)
      .then((res) => {
        console.log("Note updated:", res.data);  
  
        toast.success("Note updated successfully");
  
        
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note.slug === slug ? { ...note, ...res.data } : note))
        );
      })
      .catch((err) => {
        toast.error("Failed to update note");
        console.error("Error updating note:", err.message);  
      });
  };
  

  const deleteNote = (slug) => {
    axios
      .delete(`http://127.0.0.1:8000/notes/${slug}/`)
      .then(() => {
        toast.success("Note deleted successfully");
  
   
        setNotes((prevNotes) => prevNotes.filter((note) => note.slug !== slug));
      })
      .catch((err) => {
        toast.error("Failed to delete note");
        console.error("Error deleting note:", err.message);
      });
  };
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={
          <MainLayout
            searchText={searchText}
            handelSearchText={handelSearchText}
          />
        }
      >
        <Route
          index
          element={
            <HomePage
              notes={filteredNotes}
              loading={isLoading}
              handleFilterText={handleFilterText}
            />
          }
        />
        <Route path="/add-note" element={<AddNotePage addNote={addNote} />} />
        <Route
          path="/edit-note/:slug"
          element={<EditNotePage updateNote={updateNote} />}
        />
        <Route
          path="/notes/:slug"
          element={<NoteDetailPage deleteNote={deleteNote} />}
        />
      </Route>
      
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
