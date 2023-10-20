import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from './Form';

function MyApp() {
    const [characters, setCharacters] = useState([]);

    // Fetch users when the component mounts
    useEffect(() => {
        fetchUsers()
            .then((users_list) => setCharacters(users_list))
            .catch((error) => { console.log(error); });
    }, []);

    
    function removeOneCharacter(index) {
      const character = characters[index];
      fetch(`http://localhost:8000/users/${character.id}`, { method: 'DELETE' })
          .then(response => {
              if (response.status === 204) {
                  const updated = characters.filter((character, i) => i !== index);
                  setCharacters(updated);
              } else if (response.status === 404) {
                  console.log('User not found');
              }
          })
          .catch((error) => {
              console.log(error);
          });
    }

    // New function to make POST request to add new user
    function postUser(person) {
        return fetch("http://localhost:8000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        })
        .then(response => Promise.all([response.json(), response]));
      }

    // Updated function to update the character list
    function updateList(person) {
        postUser(person)
          .then(([userWithId, response]) => {
            if (response.status === 201) {
              setCharacters([...characters, userWithId])
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }


    function deleteUser(id) {
      const promise = fetch(`http://localhost:8000/users/${id}`, {
          method: "DELETE",
      });
  
      return promise;
    }
  

    function removeCharacterById(id) {
      deleteUser(id)
          .then(() => {
              const updated = characters.filter((character) => character.id !== id);
              setCharacters(updated);
          })
          .catch((error) => {
              console.log(error);
          });
    }

    return (
        <div className="container">
            <Table characterData={characters} removeCharacter={removeOneCharacter} removeCharacterById={removeCharacterById} />
            <Form handleSubmit={updateList} />
        </div>
    );
}


function fetchUsers() {
    return fetch("http://localhost:8000/users")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => data.users_list) // Extract the users_list from the response data
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

export default MyApp;