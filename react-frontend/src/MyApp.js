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
        const updated = characters.filter((character, i) => {
            return i !== index;
        });
        setCharacters(updated);
    }

    // New function to make POST request to add new user
    function postUser(person) {
        const promise = fetch("http://localhost:8000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(person),
        });

        return promise;
    }

    // Updated function to update the character list
    function updateList(person) {
        postUser(person)
            .then(() => setCharacters([...characters, person]))
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className="container">
            <Table characterData={characters} removeCharacter={removeOneCharacter} />
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
        .then(data => data)
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

export default MyApp;