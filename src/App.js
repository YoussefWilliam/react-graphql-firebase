import React, { useState } from "react";
import "./App.css";
import { Button, Table, Spinner, Form } from "react-bootstrap";
import { useQuery, gql, useMutation } from "@apollo/client";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const GET_USERS = gql`
    query {
      users {
        fullName
        age
        uni
        home
      }
    }
  `;
  const ADD_USER = gql`
    mutation($fullName: String, $age: Int, $uni: String, $home: String) {
      addUser(fullName: $fullName, age: $age, uni: $uni, home: $home) {
        fullName
        age
        uni
        home
      }
    }
  `;

  const { loading, data, error, refetch } = useQuery(GET_USERS);

  const [createUser, { isCreating }] = useMutation(ADD_USER);

  const [name, setUserName] = useState();
  const [age, setUserAge] = useState();
  const [home, setUserHome] = useState();
  const [uni, setUserUni] = useState();

  const handleOnChange = (type, value) => {
    switch (type) {
      case "name":
        setUserName(value);
        return;
      case "age":
        setUserAge(value);
        return;
      case "uni":
        setUserUni(value);
        return;
      case "home":
        setUserHome(value);
        return;
    }
  };

  const isDisabled = !home || !uni || !age || !name;

  return (
    <div className="App">
      <h1>Let's go</h1>
      {loading || isCreating ? (
        <Spinner animation="grow" />
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Age</th>
                <th>Home</th>
                <th>University</th>
              </tr>
            </thead>
            <tbody>
              {data?.users?.map((user, i) => (
                <tr>
                  <td>{i + 1}</td>
                  <td>{user.fullName}</td>
                  <td>{user.age}</td>
                  <td>{user.home}</td>
                  <td>{user.uni}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Form inline className="d-inline-flex">
            <Form.Control
              className="mb-2 mr-sm-2"
              type="text"
              placeholder="Full Name"
              onChange={(e) => handleOnChange("name", e.target.value)}
            />
            <Form.Control
              className="mb-2 mr-sm-2"
              type="text"
              placeholder="Age"
              onChange={(e) => handleOnChange("age", e.target.value)}
            />
            <Form.Control
              className="mb-2 mr-sm-2"
              type="text"
              placeholder="Home"
              onChange={(e) => handleOnChange("home", e.target.value)}
            />
            <Form.Control
              className="mb-2 mr-sm-2"
              type="text"
              onChange={(e) => handleOnChange("uni", e.target.value)}
              placeholder="University"
            />
            <Button
              type="submit"
              className="mb-2"
              disabled={isCreating || isDisabled}
              onClick={async (e) => {
                e.preventDefault();
                await createUser({
                  variables: {
                    fullName: name,
                    age: parseInt(age),
                    uni: uni,
                    home: home,
                  },
                }).then(() => refetch());
              }}
            >
              Submit new user
            </Button>
          </Form>
        </>
      )}
    </div>
  );
}

export default App;
