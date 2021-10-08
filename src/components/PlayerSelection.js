const PlayerSelection = () => {
  return (
    <section className="playerSelection">
      <form action="">
        <label htmlFor="playerOne">Player One</label>
        <input
          type="radio"
          id="playerOne"
          name="playerSelection"
          value="playerOne"
        />

        <label htmlFor="playerTwo">Player Two</label>
        <input
          type="radio"
          id="playerTwo"
          name="playerSelection"
          value="playerTwo"
        />

        <button type="submit">Ready!</button>
      </form>
    </section>
  );
};

export default PlayerSelection;
