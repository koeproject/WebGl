import { BlockSphere } from "./src/blochSphere";

const canvas = document.getElementById('renderer')
const sphere = new BlockSphere(canvas)

function loop(){
    sphere.renderer()
    requestAnimationFrame(loop)
}

loop()