import "../../styles/board-frame.css"

export default function BoardFrame({ children }) {
  return (
    <main className="pknu-board-stage">
      <section className="pknu-board-frame">
        <div className="pknu-board-frame__edge pknu-board-frame__edge--top" aria-hidden="true" />
        <div className="pknu-board-frame__edge pknu-board-frame__edge--right" aria-hidden="true" />
        <div className="pknu-board-frame__edge pknu-board-frame__edge--bottom" aria-hidden="true" />
        <div className="pknu-board-frame__surface">{children}</div>
      </section>
    </main>
  )
}
