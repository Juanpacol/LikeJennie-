// Recorta el sujeto de una foto y lo guarda como PNG con fondo transparente.
// Usa el recorte de sujeto de Apple (Vision, macOS 14+): corre en local y no descarga nada.
//   swift scripts/cutout.swift foto.jpg salida.png          (todos los sujetos)
//   swift scripts/cutout.swift foto.jpg salida.png --main   (solo el sujeto principal)
// Con --main se conserva únicamente el sujeto que queda en el centro de la foto (o el más grande),
// útil cuando detecta de más: otra persona al fondo, una cortina, etc.
import AppKit
import CoreImage
import Vision

guard CommandLine.arguments.count >= 3 else {
  print("Uso: swift scripts/cutout.swift <entrada> <salida.png> [--main]")
  exit(1)
}

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])
let mainOnly = CommandLine.arguments.contains("--main")

guard let input = CIImage(contentsOf: inputURL) else {
  print("No se pudo leer \(inputURL.path)")
  exit(1)
}

let request = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(ciImage: input)
try handler.perform([request])

guard let observation = request.results?.first else {
  print("No se encontró ningún sujeto en \(inputURL.lastPathComponent)")
  exit(1)
}

// Sujeto principal: el de la máscara en el centro de la imagen o, si ahí no hay ninguno, el más grande.
func mainInstance(of observation: VNInstanceMaskObservation) -> IndexSet {
  let buffer = observation.instanceMask
  CVPixelBufferLockBaseAddress(buffer, .readOnly)
  defer { CVPixelBufferUnlockBaseAddress(buffer, .readOnly) }
  guard let base = CVPixelBufferGetBaseAddress(buffer) else { return observation.allInstances }
  let width = CVPixelBufferGetWidth(buffer)
  let height = CVPixelBufferGetHeight(buffer)
  let stride = CVPixelBufferGetBytesPerRow(buffer)
  let pixels = base.assumingMemoryBound(to: UInt8.self)

  var areas: [Int: Int] = [:]
  for y in 0..<height {
    for x in 0..<width {
      let label = Int(pixels[y * stride + x])
      if label != 0 { areas[label, default: 0] += 1 }
    }
  }
  let center = Int(pixels[(height / 2) * stride + width / 2])
  let chosen = center != 0 ? center : (areas.max { $0.value < $1.value }?.key ?? 0)
  print("sujetos detectados: \(areas.count) -> se conserva el \(chosen)")
  return chosen == 0 ? observation.allInstances : IndexSet(integer: chosen)
}

let instances = mainOnly ? mainInstance(of: observation) : observation.allInstances
let masked = try observation.generateMaskedImage(
  ofInstances: instances,
  from: handler,
  croppedToInstancesExtent: true
)
let output = CIImage(cvPixelBuffer: masked)
let context = CIContext()
try context.writePNGRepresentation(
  of: output,
  to: outputURL,
  format: .RGBA8,
  colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!
)
print("OK \(outputURL.lastPathComponent): \(Int(output.extent.width))x\(Int(output.extent.height))")
