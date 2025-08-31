export function createTimerElement() {
  const el = document.createElement("div");
  el.style.cssText =
    "position:absolute;top:20px;left:20px;font-size:24px;color:white;background:rgba(0,0,0,0.6);padding:8px 12px;border-radius:8px;font-family:Arial,sans-serif;z-index:100;";
  document.body.appendChild(el);
  return el;
}

export function createScoreElement() {
  const el = document.createElement("div");
  el.style.cssText =
    "position:absolute;top:20px;right:20px;font-size:24px;color:white;background:rgba(0,0,0,0.6);padding:8px 12px;border-radius:8px;font-family:Arial,sans-serif;z-index:100;";
  el.innerHTML = "Score: 0";
  document.body.appendChild(el);
  return el;
}

export function createGameOverOverlay() {
  const el = document.createElement("div");
  el.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.85);
    color: white;
    font-size: 28px;
    padding: 20px 40px;
    border-radius: 12px;
    text-align: center;
    font-family: Arial, sans-serif;
    z-index: 999;
    display: none;
  `;
  document.body.appendChild(el);
  return el;
}


export function createStartButton(onStart) {
  const container = document.createElement("div");
  container.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-family: Arial, sans-serif;
    z-index: 1000;
  `;

  const instructions = document.createElement("div");
  instructions.innerHTML = `
    <div style="font-size:20px; margin-bottom:20px; color:#333;">
      🕹️ <strong>How to Play:</strong><br>
      Use <strong>A / D</strong> or <strong>← / →</strong> to move<br>
      Collect as many coins as you can<br>
      Avoid the red balls (obstacles)<br>
      You have <strong>60 seconds</strong> — make it count!
    </div>
  `;

  const btn = document.createElement("button");
  btn.innerText = "▶ Start Game";
  btn.style.cssText = `
    font-size: 24px;
    padding: 12px 24px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  `;

  btn.onclick = () => {
    document.body.removeChild(container);
    onStart();
  };

  container.appendChild(instructions);
  container.appendChild(btn);
  document.body.appendChild(container);
}
