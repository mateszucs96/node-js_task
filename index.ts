export default function getRandomNumber(): void {
  const randomNum = Math.floor(Math.random() * 1000) + 1;
  console.log(randomNum);
}

// Call the function to log the random number
getRandomNumber();
