function myFirst(str1) {
    console.log(str1);
  }
  
  function mySecond(str1, MyCallBack) {
    MyCallBack(str1);
    console.log("Lol");
  }
  console.log("Hmm...")
  setTimeout(myFirst, 3000);
