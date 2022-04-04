import React from "react";
import "./App.css";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, orderBy } from "firebase/firestore";

firebase.initializeApp({
  apiKey: process.env.FIREBASE_API,
  authDomain: "resistoridenti.firebaseapp.com",
  projectId: "resistoridenti",
  storageBucket: "resistoridenti.appspot.com",
  messagingSenderId: "28137947777",
  appId: "1:28137947777:web:5cb3085819776cd2bec380",
});

const firestore = firebase.firestore();

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Nav />
        <ResistorSessions />
      </header>
    </div>
  );
}

function Nav() {
  return (
    <nav class="bg-gray-900 text-gray-200 shadow-lg px-2 sm:px-4 py-2.5 rounded">
      <div class="grid place-items-center">
        <a href="/" class="flex items-center">
          <img src="favicon.ico" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
          <span class="text-xl font-semibold whitespace-nowrap dark:text-white">
            ORSI Central Database
          </span>
        </a>
      </div>
    </nav>
  );
}

function ResistorSessions() {
  const [sessions] = useCollection(
    query(collection(firestore, "sessions"), orderBy("time", "desc"))
  );
  return (
    <>
      <section className="p-4 grid gap-4 grid-cols-auto">
        {sessions &&
          sessions.docs.map((session) => (
            <Card key={session.id} session={session} />
          ))}
      </section>
    </>
  );
}

function Card(props) {
  const { time, total } = props.session.data();
  const date = time.toDate().toDateString();
  const localTime = time.toDate().toLocaleTimeString("en-US");
  return (
    <div>
      <div className="flex w-full items-center dark:bg-gray-900 justify-center">
        <div>
          <div className="w-64 h-64 flex flex-col bg-gray-800 rounded-lg border border-gray-400 mb-6 py-5 px-4">
            <div>
              <h4 className="text-gray-100 font-bold mb-3 text-center">
                {date}
              </h4>
              <p className="text-gray-100 text-sm text-center">{localTime}</p>
            </div>
            <div className="flex text-5xl flex-col items-center justify-center text-gray-800 mt-8 mb-2">
              <span className="text-gray-100 mb-2">{total}</span>
              <p className="text-sm text-gray-100">Resistors Scanned</p>
            </div>
            <Modal id={props.session.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Modal(props) {
  const [showModal, setShowModal] = React.useState(false);
  const [scans] = useCollection(
    firestore.collection("sessions").doc(props.id).collection("scans")
  );

  return (
    <>
      <button
        className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => {
          setShowModal(true);
        }}
      >
        View Resistors
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-full">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Scanned Resistors</h3>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  {scans ? (
                    <>
                      <div className="flex flex-col">
                        <div className="overflow-x-auto shadow-md sm:rounded-lg">
                          <div className="inline-block min-w-full align-middle">
                            <div className="overflow-hidden ">
                              <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                                    >
                                      Resistance
                                    </th>
                                    <th
                                      scope="col"
                                      className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                                    >
                                      Wattage
                                    </th>
                                    <th
                                      scope="col"
                                      className="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                                    >
                                      Scanned On
                                    </th>
                                    <th scope="col" className="p-4">
                                      <span className="sr-only">Edit</span>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                  {scans.docs.map((scan) => (
                                    <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                      <ScannedTable key={scan.id} scan={scan} />
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

function ScannedTable(props) {
  const { scan } = props;
  return (
    <>
      <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {scan.data().resistance} Ohm
      </td>
      <td className="py-4 px-6 text-sm font-medium text-gray-500 whitespace-nowrap dark:text-white">
        {scan.data().wattage} Watts
      </td>
      <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {scan.data().createdAt.toDate().toDateString()},{" "}
        {scan.data().createdAt.toDate().toLocaleTimeString("en-US")}
      </td>
    </>
  );
}

export default App;
