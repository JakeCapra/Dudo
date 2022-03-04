import '../styles/App.css';
import React, { useContext, useState, useEffect } from 'react';
import JoinGame from '../components/join';
import HostGame from '../components/host';
import Player from "../components/player";
import Oponent from '../components/oponent';
import { SocketContext } from '../components/socketContext';
import Notification from '../components/notification';
import LatestBid from '../components/latestBid';

function App() {

  const socket = useContext(SocketContext);
  const [name, setName] = useState(null);
  const [room, setRoom] = useState(null);
  const [show, setShow] = useState(true);
  const [player, setPlayer] = useState([]);
  const [oponents, setOponents] = useState([]);
  const [oponentsComponents, setOponentsComponents] = useState([]);
  const [playerHand, setPlayerHand] = useState(null);
  const [notification, setNotification] = useState({});
  const [latestBid, setLatestBid] = useState();

  useEffect(() => {
    // Adding an event listener to the socket to listen for new players
    // It will continually listen to the players event being emitted from the backend
    // And whenever a new player is added or remove, it will update the players array
    socket.on('players', players => {
      // players = players.players;
      console.log("Recived Players", players);

      let oponentsBuilder = [];

      for (let i = 0; i < players.length; i++) {
        console.log(players[i].playerName != name);
        if (players[i].playerName != name)
          oponentsBuilder.push(players[i])
        else {
          console.log("Player:", players[i])
          setPlayer(players[i]);
        }
      }

      setOponents(oponentsBuilder);

      const oponentComponentBuilder = oponentsBuilder.map((oponent) =>
        <Oponent name={oponent.playerName} key={oponent.playerName} diceNum={oponent.diceCount} />
      );

      setOponentsComponents(oponentComponentBuilder)
    })
  }, [socket, name])

  useEffect(() => {

    const handleNewBid = (newBid) => {
      setLatestBid(newBid);
    }

    socket.on('diceForRound', dice => {
      setPlayerHand(dice);
      console.log("Players dice:", dice);
    });

    socket.on('notification', notification => {
      console.log(notification);
      setNotification(notification);
    })

    socket.on('newBid', handleNewBid);

  }, [socket])

  const leaveGame = () => {
    setName(null);
    setRoom(null);
    setOponentsComponents([]);
    setShow(true);
  }

  const showLeave = () => {
    if (!show)
      return <button onClick={leaveGame}>Leave Game</button>
  }

  const showRoom = () => {
    if (!show)
      return <h1>Room Code: {room}</h1>
  }

  const startGame = () => {
    socket.emit('startGame');
  }

  const showStart = () => {
    if (!show)
      return <button onClick={startGame}>Start Game</button>
  }

  return (
    <div id="game">
      <HostGame name={name} setName={setName} room={room} setRoom={setRoom}
        show={show} setShow={setShow} socket={socket} />

      <JoinGame name={name} setName={setName} room={room} setRoom={setRoom}
        show={show} setShow={setShow} socket={socket} />
      {showRoom()}
      <Notification notification={notification} show={show} />
      <LatestBid bid={latestBid} show={show} />
      <Player name={name} show={show} diceNum={player.diceCount} socket={socket}
        id={socket.id} playerHand={playerHand} />
      <div id='players'>
        {oponentsComponents}
      </div>
      {showStart()}
      {showLeave()}
    </div>
  );
}

export default App;
