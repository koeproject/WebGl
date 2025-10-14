import { BlochSphere } from "./src/blochSphere.js"

const canvas = document.getElementById("renderer")
const sphere = new BlochSphere(canvas)

function loop(){
    sphere.render()
    requestAnimationFrame(loop)
}

loop()