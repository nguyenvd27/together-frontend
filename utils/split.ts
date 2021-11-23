export const GetImageName = (imageUrl: string) => {
  const imageUrlSplit = imageUrl.split('/');
  return imageUrlSplit[imageUrlSplit.length-1]
}
