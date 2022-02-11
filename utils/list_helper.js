const dummy = () => {
  return 1;
}

module.exports = {
  dummy
}

const totalLikes = (blogs) => {
  let total = 0
  blogs.forEach(element => {
    total += element.likes
  })
  return total
}

module.exports = {
  dummy,
  totalLikes
}