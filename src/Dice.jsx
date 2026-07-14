export default function Dice({
    value,
    isHeld,
    hold,
    id,
    isRolling
}) {

    const styles = {
        backgroundColor: isHeld ? "#59E391" : "white"
    };

    return (
        <button
            style={styles}
            className={
                isRolling && !isHeld
                    ? "rolling-dice"
                    : ""
            }
            onClick={() => hold(id)}
            aria-pressed={isHeld}
            aria-label={`Die with value ${value},
            ${isHeld ? "held" : "not held"}`}
        >
            {value}
        </button>
    );
}