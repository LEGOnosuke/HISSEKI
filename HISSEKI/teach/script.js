$(function () {

  console.log("エヴァンゲリオンとジャヴァンゲリオン");
  console.log("———富・名声・力。この世のすべてを手に入れた男、海賊王ゴールド・ロジャー。彼の死に際に放った一言は、人々を海へ駆り立てた。「おれの財宝か？欲しけりゃくれてやる。探せ！この世のすべてをそこに置いてきた！」男達は、グランドラインを目指し、夢を追い続ける。世はまさに、大海賊時代！")

  ///変数で遊ぶゾーン
  var S = "ウルトラマン"

  var Q = 3
  while (Q < 10) {
    Q = Q + 1
    console.log(Q)  
  if (Q == 9){
      console.log(S)
  }

  }

  ///関数
  console.log( testFUN(1) )
  function testFUN (x) {
      return x * x
  }

  console.log( testFUN(10) )
  console.log( testFUN(0) )

var test;
$('#gomi').click(function(){
  $(this).hide()
  
  $(this).fadeIn()
  test = $(this).text()
})
console.log(test)



  //各種ボタン要素を取得しておく
  var dialog = document.getElementById('dialog');
  var btn = document.getElementById('btn');
  var yes = document.getElementById('yes');
  var no = document.getElementById('no');
  var cancel = document.getElementById('cancel');


    
    //ボタンがクリックされたらダイアログを表示する
  btn.addEventListener('click', function() {
    dialog.style.display = 'block';
    this.style.display = 'none';
  })

  //「はい」がクリックされたら
  yes.addEventListener('click', function(){
    $('div.HAPPY').html('<h1 style = "font-size:100px;">HAPPY BIRTH DAY!!!!</h1>')
  });

  //「いいえ」がクリックされたら
  no.addEventListener('click', function(){ console.log('no') });

  //「キャンセル」がクリックされたら
  cancel.addEventListener('click', function(){ console.log('cancel') });






  var array = [
    "鈴木",//0
    "藤井",//1
    "小倉",//2
    "浅野",//3
    "永井",//4
    "太田"//5
  ]
  console.log(array)
  console.log("鈴木藤井小倉浅野永井太田")
  var result=""

  for (let index = 0; index < array.length; index++) {
    console.log(array[index])
    result = result + array[index]
  }
  console.log("result:"+result)

  var abc= {
    name:"山多",
    age:"16",
    from:"Russia",
    gender:"male",
    favorite:[
      "りんご",
      "岡ね",
     ]
  }

});