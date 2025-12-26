const findStride = (width, height) => width * height;

const generateLayers = function* (data, width, height) {
  const stride = findStride(width, height);
  let startIndex = 0;
  while ( startIndex < data.length) {
    const layer = data.slice(startIndex, startIndex + stride);
    yield { startIndex, stride, layer };
    startIndex += stride;
  }
}

const countChars = (string, character) => string.match(new RegExp(character, 'g'))?.length || 0;

const findLeastCountIndex = (data, character, width, height) => {
  const layers = generateLayers(data, width, height);
  let startIndex = 0;
  let minimumCount = Infinity;
  for (const layer of layers) {
    const count = countChars(layer.layer, character);
    if (count < minimumCount) {
      startIndex = layer.startIndex ;
      minimumCount = count;
    }
  }
  return startIndex;
}

const findProduct = (data, width, height) => {
  const startIndex = findLeastCountIndex(data, '0', width, height);
  const stride = findStride(width, height);
  const layer = data.slice(startIndex, startIndex + stride);
  const onesCount = countChars(layer, '1');
  const twosCount = countChars(layer, '2');
  return onesCount * twosCount;
}

const getFinalImage = (data, width, height) => {
  const stride = findStride(width, height);
  const finalImage = '2'.repeat(stride).split('');
  const layers = generateLayers(data, width, height);
  while (finalImage.includes('2')) {
    const layer = layers.next()?.value?.layer.split('') || [];
    for (const index in layer) {
      if (finalImage[index] === '2' && layer[index] !== '2') {
        finalImage[index] = layer[index];
      }
    }
  }
  return finalImage;
}

const plotImage = (image, width) => {
  const newImage = Array.from(image, digit => digit === '0' ? '⬛️' : '⬜️');
  let start = 0;
  while (start < image.length) {
    const row = newImage.slice(start, start + width);
    console.log((row).join(''));
    start += width;
  }
}

plotImage(getFinalImage(Deno.args[0], +Deno.args[1], +Deno.args[2]), +Deno.args[1]);
