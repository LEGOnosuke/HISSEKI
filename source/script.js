//UserAgent で判定
var userAgent = window.navigator.userAgent.toLowerCase();
var appVersion = window.navigator.appVersion.toLowerCase();

if (userAgent.indexOf('msie') != -1) {
    alert("このアプリはInternet Explolerに対応していません。")
    $('body').text("申し訳ありません。このアプリはInternet Explolerには対応しておりません。他のブラウザをご使用願います。")
}

/**
     * 言語設定に応じてリダイレクト
     *
     *
     */

 function ridirectURL()  {
    const baseUrl = '/';
    const browserLang = (window.navigator.languages && window.navigator.languages[0]) ||
      window.navigator.language ||
      window.navigator.userLanguage ||
      window.navigator.browserLanguage;

    // console.log(browserLang); ←コンソールにブラウザの言語設定を表示させる

    switch(browserLang) {
      // 英語
      case 'en':
      case 'en-US':
        location.href = `${baseUrl}en`;
        break;
      // 簡体字
      case 'zh-CN':
      case 'zh-Hans':
      case 'zh-SG':
        location.href = `${baseUrl}cs/`;
        break;
      // 繁体字
      case 'zh-Hant':
      case 'zh-MO':
      case 'zh-HK':
      case 'zh-TW':
        location.href = `${baseUrl}ct/`;
        break;
      default:
        break;
    }
  };

  /**
   * セッション初回の判定
   *
   * 
   */
  function firstOrNot() {
    // sessionStorageに 'access' というアイテムがなかったら
    if(!sessionStorage.getItem('access')){
      sessionStorage.setItem('access', 0); // sessionStorageにアイテムをセット
      ridirectURL(); // 前述のリダイレクト処理を実行
    }
  };
$(function () {
    //ver1.06
    //変数を設定　
    $.cookie.json = true;
    var title = "";
    var tags = [] ;
    var content = "";
    var titleArray = []//["タイトル１","タイトル2" ・・・]
    var titleObjectIndex = {} //{ タイトル１:"note1" ,タイトル２:"note2" }
    var tagsArray = []
    var randomOR ;
    var toggleRandom = true;
    //0・・・訪問したことない
    //1・・・訪問したことがある。
    $('.randomShow').hide()
    if ($.cookie('visited') == 1) {//訪問したことがあって、メモを作ったことがある。
        //データを表示
        console.log('訪問したことがあります。')
        //タイトルを格納
        settingTitleData ()
        showCookieData()
    } else {//訪問もしてないし、メモも作ったことない。
        $.cookie('number', 0, { expires: 730 });//メモの番号を設定
        $.cookie('visited', 1, { expires: 730 });//訪問したことを保存
        $.cookie('folderObjectCookie',{}, { expires: 730 })
        $.cookie('folderObjectNameCookie',{}, { expires: 730 })
        $.cookie('existTags',[], { expires: 730 })
        $.cookie("deleteFolderListCookie",[], { expires: 730 })
        $.cookie("tagObjectIndexCookie",{}, { expires: 730 })
        console.log("訪問したことがないので、cookieのnumberを0に設定します。")
    }
    //訪問クッキーここまで
    var reference;
    if($.cookie("existCookie") == undefined){
        var existCookie = []
    }else{
        var existCookie = $.cookie("existCookie")//["note1"・・・]
    }
    
    var tagsArray = $.cookie("existTags")//["note1"・・・]
    var tagObjectIndex = $.cookie("tagObjectIndexCookie")
    
    //-----------------メモ作成画面-----------------
    $('.addMemo').click(function () {
        if ($('.makeNote-wrapper').hasClass('makeNoteShow')) {
            //何もしない
            //console.log('すでに開いています。')
        } else {
            $('.makeNote-wrapper').addClass('makeNoteShow');
            var newMemo = $.cookie('number') + 1;//新しくメモを作る
            $.cookie('number', newMemo, { expires: 730 });//numberに新しい値を代入

            console.log("makeNoteを開きます。")
            console.log('cookieのnumberを+1します')
            reference = "note" + $.cookie('number');
            existCookie.push(reference)//existCookie -> ["note1"]   ["note1","note2"]
            title = "";
            tags = []
            content = "";
            $('.title-input').focus()
        }
        
    });
    $('.quit').click(function () {
        $(this).blur()
        $('.addMemo').animate({
            opacity:"1",
            right:"50px",
            bottom:"60px",
            
        },200);
        $('.makeNote-wrapper').removeClass('makeNoteShow');
        var trashCookie = "note" + $.cookie('number');//note5
        var deleteCookieIndex = existCookie.indexOf(trashCookie);//["note1","note2","note3","note4","note5"] この場合4がdeleteCookieIndex
        console.log(existCookie);
        console.log(deleteCookieIndex);
        if (deleteCookieIndex > -1) {
            existCookie.splice(deleteCookieIndex, 1);//["note1","note2","note3","note4","note5"].splice(4,1)
        }else{
            console.error('(((o(*ﾟ▽ﾟ*)o)))♡')
        }
        $.cookie('existCookie', existCookie)
        $.removeCookie(trashCookie);
       
        var quitMemo = $.cookie('number') - 1;//やめる
        $.cookie('number', quitMemo);//numberの数をひとつ減らす
        $('.title-input').val("");
        $('.tag-input').val("");
        $('.content-input').val("");
        $('.decideTag').empty();
        console.log("cookieのnumberを-1します")
        console.log("保存済みのcookieを削除します")
        console.log("記入済みのテキストを削除します")
    });
    $('.complete').click(function () {
        if ($('.title-input').val() == "") {
            var now = new Date
            title = now.getMonth() + 1 + "/"  +now.getDate() 　+　"　無題のメモ"
        }//タイトル必須にする。もしタイトルが空だったらcompleteの実行ではなくて、quitの実行にシフトチェンジしてreturnで$('.complete').click()を強制終了させる
        
        $(".title-input").blur()
        $(".tags-input").blur()
        $(".content-input").blur()
       $('.addMemo').animate({
            opacity:"1",
            right:"50px",
            bottom:"60px",
            
        },200);
        var cookieData = {
            number: $.cookie('number'),
            title: title,
            tags: tags,
            content: content
        }
        $.cookie(reference, cookieData, { expires: 730 });
        $('.makeNote-wrapper').removeClass('makeNoteShow');
        $('.title-input').val("");
        $('.tag-input').val("");
        $('.content-input').val("");
        $('.decideTag').empty();//== text("")
        //<input>  -> val("")
        //<div></div> -> text("") = empty()
        //各種初期化
        console.log("makeNoteを閉じます")
        console.log("記入済みのテキストを削除します。")

        //cookieデータを表示
        $.cookie('existCookie', existCookie, { expires: 730 })//出来上がったexistCookieをcookieに上書き保存
        toggleRandom = true;
        showCookieData()
        var casedTitle = title
        casedTitle = casedTitle.toLowerCase()
        casedTitle = kanaToHira(casedTitle)//小文字ひらがな　　ABCマーケット　-> abcまーけっと
        //各種表記統一
        titleObjectIndex[casedTitle] = "note" + $.cookie('number');//小文字化したタイトルをつ以下
        titleArray.push(casedTitle)//titleArrayにタイトル情報を追加する。
        console.log(titleObjectIndex)
    });
    
    $('.title-input').on("change", function () {
        //inputの中身が変わったら。これはcontentのキーを押すタイミングではなくて、ひらがなを打って、変換して確定した時に実行される
        title = $(this).val();//変更されたらとりま取得
        console.log(title);
        var cookieData = {
            number: $.cookie('number'),
            title: title,
            tags: tags,
            content: content
        }
        $.cookie(reference, cookieData, { expires: 730 });
        //保存
    });
    $('.title-input').keypress(function (event) {
        if ($('.makeNote-wrapper').hasClass('makeNoteShow') && event.key == "Enter") {
            
            title = $(this).val();//変更されたらとりま取得
            content = $('.content-input').val()
            var cookieData = {
                number: $.cookie('number'),
                title: title,
                tags: tags,
                content: content
            }
            $.cookie(reference, cookieData, { expires: 730 });
            $('.complete').trigger('click')
            
        }
    })
    $('.title-input').keyup(function(e) {
        if ($('.makeNote-wrapper').hasClass('makeNoteShow') && e.which == 27) {
            
            $(this).blur()
            $('.quit').trigger('click')
           
        }
   });
   $(window).keydown(function(e){//多分消す
    if ($('.makeNote-wrapper').hasClass('makeNoteShow') || $("input").is(":focus")) {
        //何もしない
        //console.log('すでに開いています。')
    }else{
        if(e.shiftKey){
            if(e.keyCode === 78){
              $('.addMemo').trigger('click')
              setTimeout(function(){
                  $('.title-input').val("")
              },10)
              
            }
          }
    }
  });
    $('.tag-input').keypress(function (event) {
        var tagText = $('.tag-input').val();
        //仕様としてはタグ入力をした後にエンターを押したらタグを作成するので、エンターを押した時に実行する。引数にeventを入れるのがだいじ
        if (event.key == "Enter" && tagText !== "") {//もしeventのキーがenterだった時に
            //とりま取得してtagTextに代入
            console.log("タグを作ります。")
            makeCompleteTag(tagText);//makeCompletetagに決定されたタグ文章（tagtext）を渡して、タグを作ってもらう
            $('.tag-input').val("");//次のタグを入力するためにinputをからにする
            console.log("タグ入力を消しました。")
            
                var cookieData = {
                    number: $.cookie('number'),
                    title: title,
                    tags: tags,
                    content: content
                }
                $.cookie(reference, cookieData, { expires: 730 });
            //保存〜保存〜
            tagsArray.push(tagText)
            tagsArray.sort()
            tagsArray = tagsArray.filter(function (x, i, self) {
                return self.indexOf(x) === i;
            });
            $.cookie("existTags",tagsArray)
            console.log(tagsArray)
            if (tagObjectIndex[tagText] == undefined) {
                tagObjectIndex[tagText] = [reference]
            }else{
                var pushArrayTags = tagObjectIndex[tagText]
                pushArrayTags.push(reference)
                tagObjectIndex[tagText] = pushArrayTags
            }
            $.cookie("tagObjectIndexCookie",tagObjectIndex)
           console.log(tagObjectIndex)
        }
        console.log("")
        //ひと段落終わったので改行代わりに虚無を出力
    })

    $('.content-input').on("input", function () {
        //これは内容を入力するたびというイベントハンドラー
        content = $(this).val();//とりま黙って取得
        console.log(content);

        var cookieData = {
            number: $.cookie('number'),
            title: title,
            tags: tags,
            content: content
        }
        $.cookie(reference, cookieData, { expires: 730 });
        console.log("cookieに内容を保存しました。")
        //保存〜保存〜保存〜♪
    });

    $(document).on('click', '.madeTag', function () {
        //作られたタグを消したいときは作られたタグをクリックorタップ
        $(this).remove();//とりあえず.decideTagから解雇
        var deleteTagId = $(this).attr('id');//クリックされたタグがどんな値なのかは.madeTagのID名に保存してあるから、ID名を読み込むことでデータの引き渡しをしている
        console.log(deleteTagId + "を配列から削除します。")
        var index = tags.indexOf(deleteTagId);
        if (index > -1) {
            tags.splice(index, 1);
        }//昨日のと全く同じ。tagsから取り除いてる。
        console.log(tags);

        var deleteTagArrayIndex = tagsArray.indexOf(deleteTagId);//["note1","note2","note3","note4","note5"] この場合4がdeleteCookieIndex
        if (deleteTagArrayIndex > -1) {
            tagsArray.splice(deleteTagArrayIndex, 1);//["note1","note2","note3","note4","note5"].splice(4,1)
        }
        $.cookie('existTags', tagsArray)

        delete tagObjectIndex[deleteTagId]
    });



    function makeCompleteTag(tagText) {
        //引き渡された被疑者...じゃなくて決定されたタグ名はここに輸送される。
        var newTag = $('<p></p>', {
            "class": "madeTag",
            "id": tagText
        })//タグを生成
        newTag.html("#" + tagText)
        $('.decideTag').append(newTag)
        //タグ生成ここまで
        console.log("「" +tagText +"」"+ 'のタグを生成しました。')
        tags.push(tagText);//配列のtagsに追加
        console.log("配列にタグを追加しました。")
        console.log(tags);
    }

    //-----------------メモ作成ここまで-----------------

    //-----------------メモ表示ここから-----------------
    function showCookieData (){
        $('.catalog').removeClass('filterDisplay')//階層機能のやつ（消さないで）
        $('.catalog').text("");
        $('.catalogPopup').text("");
        
        
        randomOR = false
        
        
        //ランダム機能終わり
        //カタログを初期化
        if($.cookie("existCookie") !== undefined){//何も作っていない時はエラーになるので省く  ["note1","note2","note3","note4","note5"]
            var gotExsistArray = $.cookie('existCookie');//配列のcookieのexistCookieを代入。それぞれ実行していく。
            for (let i = 0; i < gotExsistArray.length; i++) {
                
                var notes = gotExsistArray[i];//notesでnot1やnote2など
                var noteContent = $.cookie(notes);//タイトルとかを含めたすべての内容を取得
                if(noteContent !== undefined){//もしタイトルやタグなどが一個もなかった時（そんなの存在せえへん）は省く
                    var numberData = noteContent.number;//1
                    var titleData = noteContent.title;//〜
                    var tagData = noteContent.tags;//["=","〜"]
                    var contentData = noteContent.content;//...
                    //各種のデータを引き出す。
                    makeDataDOM(numberData,titleData,tagData,contentData)
                    //makeDataDOMに引き出したデータをsurrenderする。
                    
                }else{
                    console.error('(๑╹ω╹๑ ) ＜タイトルやタグが一個も存在しないよ！')
                    //(((o(*ﾟ▽ﾟ*)o)))♡<ｴﾗｰﾀﾞﾖ
                }
            
            }
        }
        if (titleArray.length > 19) {
            randomOR = toggleRandom
        }
        makeRandomWrapper ()
        randomAppeared ()
        randomOR = false
    }
/*
var makeDOM = $("<div>",{
    "class":"testClass"
})
makeDOM.html("つとだよ")
$('test).append or prepend(makeDOM)
<div class="testClass"></div>

tagData.push("タグ４")
console.log(tagData) -> ["タグ１","タグ２","タグ３","タグ４"]
//配列.filter(function(順番に処理する配列の要素, 順番に処理する配列のインデックス, 配列自身){
  return ここの式が真なら対象の要素を返す、偽なら何も返さない。
});
var array = [2,10,3,2,10,3,1,10,3]
var array = [1,2,3,3,2,2,5,10,10,10];

var result = array.filter(function (x, i, self) {
  return self.indexOf(x) === i;
});

console.log(result); // [ 1, 2, 3, 5, 10]

//タグを入力したたぐに以下を実行
//サジェストの関数を実行

「こ」と入力される。
var resultArray = サジェスト（こ）


function サジェストくん　（matchLetter）{
    〜〜
    var foundArray = ["こんにちは","こんばんわ","こんさん"]
    return foundArray
}

//サジェストの関数は引数を今入力しているtag-inputの値にする。

forを使ってtagsArrayの一つ一つの頭文字がmatchLetterとマッチするか件s買う（searcherと同じ感じで）
    $('.addFileInput').on("input", function () {                                                                                                                                                                                                                                                                  
        for (let i = 0; i < titleArray.length; i++) {//["タイトル１","タイトル2","タイトル３","テストた"]
            var fileTitle = titleArray[i];
            if(fileTitle.indexOf(titleSearchKey.normalize()) == 0){
                console.log(fileTitle)
                var makeTitle = $('<p></p>',{
                    "class":"smallTitle",
                    "id":fileTitle
                })
                makeTitle.html(fileTitle)
                $('.searchResult').append(makeTitle)
            }
        }
    });
*/  //---------------------------タグサジェスト→-------------------------------------
    $('.tag-input').on("input",function(){
        
        $(".suggestTags").text("")
        $('.suggestTags').show()
        var getTagKey = $(this).val();
        var countUp = getTagKey
        console.log(getTagKey)
        var resultTagsArray = mr_suggest(getTagKey)
        for (let i = 0; i < resultTagsArray.length; i++) {
            var resultTag = resultTagsArray[i]
            var makeResultTag = $('<p>',{
                "class":"madeSuggest",
                "id":resultTag
            })
            makeResultTag.html(resultTag)
            $(".suggestTags").prepend(makeResultTag)
            
        }
        var Timer;
        countUp =0
        startTimer()
       

        function startTimer(){
            
            Timer=setInterval(function(){
                countUp ++
                if (countUp > 5000) {
                    $('.suggestTags').hide()
                    stopTimer()
                }
            },1);
        }

        function stopTimer(){
            clearInterval(Timer);
        }
    })
    $(document).on("mouseenter",".madeSuggest",function(){
        $(this).css({
            background: "#5b96ee",
            color: "white"
        })
    })
    $(document).on("mouseleave",".madeSuggest",function(){
        $(this).css({
            background: "#c4c4c4",
            color: "white"
        })
    })
    $(document).on("click",".madeSuggest",function(){
        var getTagNameFromId = $(this).attr("id")
        if (getTagNameFromId !== "") {
            console.log("タグを作ります。")
            makeCompleteTag(getTagNameFromId);//makeCompletetagに決定されたタグ文章（tagtext）を渡して、タグを作ってもらう
            $('.tag-input').val("");//次のタグを入力するためにinputをからにする
            console.log("タグ入力を消しました。")
            
                var cookieData = {
                    number: $.cookie('number'),
                    title: title,
                    tags: tags,
                    content: content
                }
                $.cookie(reference, cookieData, { expires: 730 });
            //保存〜保存〜
            tagsArray.push(getTagNameFromId)
            tagsArray.sort()
            tagsArray = tagsArray.filter(function (x, i, self) {
                return self.indexOf(x) === i;
            });
            $.cookie("existTags",tagsArray)
            console.log(tagsArray)
        }
    })
    function mr_suggest (matchLetter){
        /*for(let i = 0; i < tagsArray.length; 1++){
            var matchletter = tagsArray[i].match(matchLetter);
            if(matchletter.indexof(tagSerchKey.normalize()) == 0){
                console.log(matchletter)
            }←あってるかどうかわからないので一旦コメントアウトしたというかなんというか
        }*/
        var tagsResult = []
        for(let i = 0; i < tagsArray.length; i++){
            var testTag = tagsArray[i];
            if (testTag.indexOf(matchLetter.normalize()) == 0) {
                tagsResult.push(testTag)
                console.log(testTag + "が" + matchLetter + "とマッチしました。")
            }
        }
        console.log(tagsResult)
        return tagsResult
        //多分→tagsArrayのうち、matchletterとあうものをresultという候補の配列にいれていく
    }
    //----------------------------→タグサジェスト------------------------------------

    function makeDataDOM(numberData,titleData,tagData,contentData){
        //この時に引き渡されてくる値は、ex)
        //numberData -> 1
        //title -> "タイトル１"
        //tagData -> ["タグ１","タグ２","タグ３"]
        //contentData ->　"これはテストの内容です"
        var makeTitle = $('<h2></h2>',{
            "class":"showedTitle"
        })
        if ($(window).width() > 900) {
            if (titleData.length > 20) {
                var deleteTitleLetter = 15 -titleData.length
                var slicedTitleLetter = titleData.slice(0,deleteTitleLetter)
                var shappedTitleData = slicedTitleLetter +  "…"
            }else{
                var shappedTitleData = titleData
            }
        }else{
            if (titleData.length > 8) {
                var deleteTitleLetter = 8 -titleData.length
                var slicedTitleLetter = titleData.slice(0,deleteTitleLetter)
                var shappedTitleData = slicedTitleLetter +  "…"
            }else{
                var shappedTitleData = titleData
            }
        }
        
        makeTitle.html(shappedTitleData );
        var makeTag = $('<div></div>',{
            "class":"showedTag"
        })
        var shappedTag  = "";
        //配列を分解する。配列名.forEach(function(関数内で使う変数){  〜　})でひとつ一つ取り出せる。
        tagData.forEach(function(value){
            shappedTag = shappedTag + '<p class="Tag">' + "#" + value + '</p>'
        });
        //shappedTag -> <p class="Tag">#タグ1</p><p class="Tag">#タグ2</p><p class="Tag">#タグ3</p>
        makeTag.html(shappedTag)
        
        if (randomOR == true) {
            var makeWarraper = $('<div></div>',{
                "class":"showedWrapper changedCSSRandom",
                "id":numberData
            })
        }else{
            var makeWarraper = $('<div></div>',{
                "class":"showedWrapper",
                "id":numberData
            })
        }
        
        var cancelIDName = "cancel" + numberData
        var settingIDName = "setting" + numberData

        var makeCancelIMG= $('<img src ="/images/cancel.svg" class="showedCancel" id='+ cancelIDName +'>')


        if (randomOR == true) {
            $('.randomShow').prepend(makeWarraper)
        }else{
            $('.catalog').prepend(makeWarraper)
        }
            
        
            
            //常に新しい順で上から表示。新しく作ったら上から追加
            makeWarraper.append(makeCancelIMG)
            makeWarraper.append(makeTitle)
            makeWarraper.append(makeTag)


        
        //popup
        var popTitle = $('<input>',{
            "class" : "popTitle-input",
            "placeholder":"タイトルを編集"
        })
        var popTag = $('<input>',{
            "class":"popTag-input",
            "placeholder":"タグを編集",
            "id":numberData
        })
        var popDecideTag = $('<div></div>',{
            "class":"popDecideTag"
        })
             var shappedTag  = "";
             tagData.forEach(function(value){
             shappedTag = shappedTag + '<p class="popMadeTag" id = "' + value + '">' + "#" + value + '</p>'
             });
        var contentPlaceholder ;
        if(contentData == ""){
            contentPlaceholder = "詳細を記入してください。"
        }else{
            contentPlaceholder = "編集内容を記入してください。"
        }
        var popContent = $('<textarea></textarea>',{
            "class":"popContent-input",
            "cols":"200", 
            "rows":"100",
            "placeholder":contentPlaceholder
        })
        var popAutoSave = $('<p></p>',{
            "class":"autoSave"
        })
        var popComplete = $('<p></p>',{
            "class":"edited",
            "id":numberData
        })

        var popWrapper = $('<div></div>',{
            "class":"popWrapperClass",
            "id":"pop" + numberData
        })
        $('.catalogPopup').append(popWrapper)

        popAutoSave.html('自動保存されています。')
        popComplete.html('閉じる')
        popWrapper.append(popAutoSave)
        popWrapper.append(popComplete)

        popWrapper.append(popTitle)
        popWrapper.append(popDecideTag)
        popWrapper.append(popTag)
        popWrapper.append(popContent)

        //値を代入する。
        popTitle.val(titleData)
        popDecideTag.html(shappedTag)
        popContent.val(contentData)
        
    }
    //-----------------メモ表示ここまで-----------------


    console.log(' ・ω・ ＜ぼくがマスコットだよ！');

    
    //-----------------メモ削除ここから-----------------
    //押す削除ボタンはクラスメイが.cancelNoteで、画像にid名としてcancel1,cancel2が割り振れられている。   文字列.slice(開始位置 [,終了位置] );
    //cancel.slice(6) -> 1,2 これにnoteの文字列をくっつける
    //slice() --> 指定した要素の○番目を切り取ることができる

    //押したらid名を取得して、それに適するコンテントを$.removeCookie(note1)って感じでそのまま記述する。
    //最後にshowCookieData()

    /*  要素を表示するコード
        セレクタ.animate({
            opacity:1
        },100)

    */

    //先に変数を宣言しておくことで、変数の有効範囲(スコープ?)が広がる
    var checkPopupOpened;
    var getIdFromWrapper;
    var hoveredIndex;
    
    $(document).on({
        //カーソルがClickしたとき

        'mouseenter':function(){
            //カーソルが要素に入ったとき

            hoveredIndex = $(this).attr('id') //HoverされたNote番号を取得する (ex 1
            getIdFromWrapper = "#cancel" + hoveredIndex;

            // デバッグ用 --> console.log(getIdFromWrapper);
            
            //削除ボタンを表示する
            $(getIdFromWrapper).animate({
                opacity:1
            },100)


            $(getIdFromWrapper).off('click');     // 2回目のonの前にあらかじめ.off()を実行して、二重Clickを回避する
            
            $(getIdFromWrapper).on('click', function (){
                //削除ボタンがクリックされたとき //https://programmercollege.jp/column/9937/ を参考に作成
                console.log('・ω・ ＜削除ボタン' + hoveredIndex +'がクリックされたよ！');
                //ここにポップアップの要素を.hide()する。dialogより前に処理すること。

                checkPopupOpened = true;
                console.log('checkPopupOpened: ' + checkPopupOpened);

                $("#cancelDialog").dialog({
                    //modal:true,
                    title:"メモの削除",
                    buttons: {
                      "はい": function() {
                        //はい　がクリックされたとき
                          
                        $(this).dialog("close");

                        //existCookieから削除する
                        var tempExistCookie = $.cookie('existCookie'); //Cookieから取得    //（永井より）varは宣言だから、488行目に移動
                        existIndex = tempExistCookie.indexOf('note' + hoveredIndex); //tempExistCookieの何番目に削除すべき要素があるのか見つけてexistIndexに代入

                        console.log('Clicked! : ' + hoveredIndex);

                        tempExistCookie.splice(existIndex , 1); //existIndexのexistIndex番目を削除
                        $.cookie('existCookie', tempExistCookie, { expires: 730 }); //existCookieをCookieに保存する
                        TempExistCookie = ''; //次のために一応初期化しとく？
                        $.removeCookie('note' + hoveredIndex); //Cookieのノートオブジェクトを消す
                        //Titleデータを再生成する
                        titleArray = []         //titleArrayのリセット
                        //titleObjectIndex = {}   //titleObjectIndexのリセット
                        settingTitleData () //再読み込み
                        showCookieData();　//最後に再表示

                    },
                      "いいえ": function() {
                        //いいえ　がクリックされたとき
                        $(this).dialog("close");

                    },
    
                    }
                  });
              
              });

    },
    'mouseleave':function(){
        //カーソルが要素から離れたとき
      
        var hoveredIndex = $(this).attr('id') //HoverされたNote番号を取得する
        var getIdFromWrapper = "#cancel" + hoveredIndex;
        // デバッグ用 --> console.log(getIdFromWrapper + '番の削除ボタンを非表示にしました。');

        //削除ボタンを非表示にする
        $(getIdFromWrapper).animate({
            opacity:0
        },100)
        
        }

    },'.showedWrapper');


    //-----------------メモ削除ここまで-----------------




    
    //-----------------メモ編集ここから-----------------  
    //タイトルやタグなどを代入するために宣言した
    var editNumber ;
    var editTags ;
    var editTitle ;
    var editContent ;
    $(document).on('click','.edited',function(){
        //閉じるボタンを押した時
        var targetPopNumber = "pop" + $(this).attr("id");
        //id名に情報は保存しているので取り出す。
        var targetDOM = $("#" + targetPopNumber)
        //id名から取得したpop~でフェードアウトさせる要素を特定する。
        targetDOM.fadeOut()
        $('#popupBG').fadeOut()
        if ($('.catalog').hasClass('filterDisplay')) {
            $('.folderBtn').trigger('click')
            return;
        }
        showCookieData()
        
        //住所特定したtargetDOMをフェードアウト。後ろのグレーのカバーもフェードアウトさせてカラーコーンを送りつける。
    })
    $(document).on('keypress','.popTag-input',function (event) {
        //タグうの編集
        var popTagNumberNote = "note" + editNumber
        //editNumberはメモ詳細で定義しています。
        //これはほとんど新規作成のコードと同じ
        console.log(popTagNumberNote)
            var popTagText = $(this).val();
            if (event.key == "Enter" && popTagText !== "") {
        console.log("タグを作ります。")
        //専用のタグ作成を設定
            popMakeCompleteTag(popTagText);

            $(this).val("");
            console.log("タグ入力を消しました。")
            if (editTitle !== "") {
                var cookieData = {
                    number: editNumber,
                    title: editTitle,
                    tags: editTags,
                    content: editContent
                }
                $.cookie(popTagNumberNote, cookieData, { expires: 730 });
                console.log($.cookie(popTagNumberNote));

            }
            tagsArray.push(tagText)
            tagsArray.sort()
            tagsArray = tagsArray.filter(function (x, i, self) {
                return self.indexOf(x) === i;
            });
            $.cookie("existTags",tagsArray)
            console.log(tagsArray)
            if (tagObjectIndex[tagText] == undefined) {
                tagObjectIndex[tagText] = [reference]
            }else{
                var pushArrayTags = tagObjectIndex[tagText]
                pushArrayTags.push(reference)
                tagObjectIndex[tagText] = pushArrayTags
            }
            $.cookie("tagObjectIndexCookie",tagObjectIndex)
           console.log(tagObjectIndex)
        }
        console.log("")
    })
    $(document).on('change','.popTitle-input',function(){
        popTitleNumberNote = "note" + editNumber
        editTitle = $(this).val();
        var cookieData = {
            number: editNumber,
            title: editTitle,
            tags: editTags,
            content: editContent
        }
        $.cookie(popTitleNumberNote, cookieData, { expires: 730 });
        console.log($.cookie(popTitleNumberNote))
    })
    $(document).on("input",'.popContent-input', function () {
        popContentNumberNote = "note" + editNumber
        editContent = $(this).val();

        var cookieData = {
            number: editNumber,
            title: editTitle,
            tags: editTags,
            content: editContent
        }
        $.cookie(popContentNumberNote, cookieData, { expires: 730 });
        console.log("cookieに内容を保存しました。")
    });
    function popMakeCompleteTag (popTagText){
        var newTag = $('<p></p>', {
            "class": "popMadeTag",
            "id": popTagText
        })
        newTag.html("#" + popTagText)
        $('.popDecideTag').append(newTag)
        console.log("「" +popTagText +"」"+ 'のタグを生成しました。')
        editTags.push(popTagText);
        console.log("配列にタグを追加しました。")
        
    }
    $(document).on('click', '.popMadeTag', function () {
        $(this).remove();
        var deleteTagId = $(this).attr('id');
        console.log(deleteTagId + "を配列から削除します。")
        var index = editTags.indexOf(deleteTagId);
        if (index > -1) {
            editTags.splice(index, 1);
        }
        console.log(editTags);
        popDeleteNumberNote = "note" + editNumber
        var cookieData = {
            number: editNumber,
            title: editTitle,
            tags: editTags,
            content: editContent
        }
        $.cookie(popDeleteNumberNote, cookieData, { expires: 730 });

        var deleteTagArrayIndex = tagsArray.indexOf(deleteTagId);//["note1","note2","note3","note4","note5"] この場合4がdeleteCookieIndex
        if (deleteTagArrayIndex > -1) {
            tagsArray.splice(deleteTagArrayIndex, 1);//["note1","note2","note3","note4","note5"].splice(4,1)
        }
        $.cookie('existTags', tagsArray)

        delete tagObjectIndex[deleteTagId]
    });
    
    //-----------------メモ編集ここまで----------------- 






    //--------------メモ詳細ここから----------------
    $(document).on('click', '.showedWrapper', function () {
        if (deleteFileType !== 2) {

            if (checkPopupOpened == true){
                //もし削除ダイアログがすでに開いていたときに、ポップアップが重複表示されないようにする
                return // return でfunctionを停止する
            }

            //メモ項目のどれかがクリックされたとき
            var targetPopNumber = $(this).attr("id"); //クリックされたメモ項目の番号を取得する
            //console.log('<DEBUG>[Clicked]targetPopNumber:' + targetPopNumber + ' existCookie:' + $.cookie('existCookie'));
            var targetDOM = $("#pop" + targetPopNumber)
            var targetPopCookie = $.cookie("note" + targetPopNumber); //クリックされたメモ項目のCookieデータ(オブジェクト形式)を取得する
            var getEditNumber = targetPopCookie.number;
            var getEditTitle = targetPopCookie.title;
            var geteditTag = targetPopCookie.tags;
            var getEditContent = targetPopCookie.content;

            editNumber = getEditNumber;
            editTitle = getEditTitle;
            editTags = geteditTag;
            editContent = getEditContent

            targetDOM.fadeIn()

            $('#popupBG').fadeIn()
            $('#popupBG').click(function () {
                $(this).fadeOut()
                targetDOM.fadeOut()
                if ($('.catalog').hasClass('filterDisplay')) {
                    $('.folderBtn').trigger('click')
                    return;
                }
                showCookieData()
            })
        }else{//フォルダーのメモ削除
            var gotTitle = $(this).last().text()
            var countUpElement = $('.catalog > div').length
            var matchedTitleProccess ;
            console.log(gotTitle)
            console.log(countUpElement)
            for (let i = 0; i < countUpElement ; i++) {
                var getTitleFromClick = $('.catalog div:nth-child(' + (countUpElement - i )+ ")").find("h2").text()
                console.log(getTitleFromClick)
                if (gotTitle == getTitleFromClick) {
                    matchedTitleProccess = i 
                }
            }
            console.log(matchedTitleProccess)
            var getPrepareCode = $('.folderBtn').attr("id")
            if (getPrepareCode == undefined) {
                var deleteFileName = "F" + matchedTitleProccess
            }else{
                var deleteFileName = getPrepareCode + "F" + matchedTitleProccess
            }
            deleteFolderList.push(deleteFileName)
            console.log(deleteFolderList)
            $(this).fadeOut(300)
            deleteFileType = 0
            $.cookie("deleteFolderListCookie",deleteFolderList)
        }

    });
    //--------------メモ詳細ここまで----------------



    

    //---------------検索機能ここから-----------------
    $('.searcher').hover(function(){
        $(this).trigger('focus')
    })
    $('.searcher').on("keyup", function () {
        $('.catalog').text("");
        $('.catalogPopup').text("");
        
       // console.log('catalogを消しました')
        var searchKey = $(this).val()
        searchKey = searchKey.toLowerCase()
        searchKey = kanaToHira(searchKey)
        var foundedAmountCount  = 0;
        if (searchKey == null) {
            showCookieData()
        }
        randomOR = false
        for (let i = 0; i < titleArray.length; i++) {//["タイトル１","タイトル2","タイトル３","テストた"]
            var titleDoc = titleArray[i];
            if(titleDoc.indexOf(searchKey.normalize()) == 0){
                //$(this).removeClass("404")
                foundedAmountCount ++;
                var resultCookieData = titleObjectIndex[titleDoc]//オブジェクト.プロパティ
                var resultNoteContent = $.cookie(resultCookieData)//おぶじぇくと["プロパティ"]
                
                if(resultNoteContent !== undefined){

                 var numberData = String(resultNoteContent.number);
                 var titleData = resultNoteContent.title;
                 var tagData = resultNoteContent.tags;
                 var contentData = resultNoteContent.content;
                 //console.log(numberData+"と"+titleData+"と"+tagData+"と"+contentData)
                makeDataDOM(numberData,titleData,tagData,contentData)

                }else{
                    console.error("( ✌︎'ω')✌︎")
                }
            }
        }
        //タグ検索(ミサトさん！そんなのできっこないよぉ！)
        /*  tagObjectIndex
        {
            tag1:[
                "note1",
                "note2",
                "note5"
            ],
            tag2:["note3"],
            tag3:[
                "note4",
                "note6"
            ]
        }*/
        //入力した値を取得する
        //tagsArrayのに一つの値を取り出し、(forで)入力した値と、一つの値の頭文字（indexOf(searchKey) !== -1）が等しい場合、次を実行。
        //等しい、tagsArrayのn番目の値を使ってtagObjectIndexから値を引き出す。
        //引き出した値は配列なので、またもやforを使って一つ一つ取り出す。（この時取り出された値はnote1やらnote2やら）
        //note1やらnote2はcookieの名前なので、これを使ってタイトルでーたやタグデータを引き出す。このコードはいろんなとこにある。
        //makeDataDOMに引数として(番号,タイトル,タグ（配列）,内容)を実行する。

        //["tag1","tag2"]
        /*  tagObjectIndex
        {
            tag1:[
                "note1",
                "note2",
                "note5"
            ],
            tag2:["note3"],
            tag3:[
                "note4",
                "note6"
            ]
        }*/
        if(searchKey.indexOf("#") == 0){
            console.log(tagsArray)
            console.log(tagObjectIndex)
            searchKey = searchKey.slice(1)
            for (let i = 0; i < tagsArray.length; i ++) {
                var tagsDoc = tagsArray[i];
                if(tagsDoc.indexOf(searchKey) !== -1){
                    console.log(tagsDoc)
                    var resultCookieData = tagObjectIndex[tagsDoc]//["note1","note2"]
                    console.log(resultCookieData)
                    for (let i = 0; i < resultCookieData.length; i ++){
                        
                        var resultDataCookieName = resultCookieData[i]
                        var resultNoteContent = $.cookie(resultDataCookieName)
    
                        if(resultNoteContent !== undefined){
    
                            var numberData = String(resultNoteContent.number);
                            var titleData = resultNoteContent.title;
                            var tagData = resultNoteContent.tags;
                            var contentData = resultNoteContent.content;
                    
                        //console.log(numberData+"と"+titleData+"と"+tagData+"と"+contentData)
                            makeDataDOM(numberData,titleData,tagData,contentData)
                        
                        }else{
                            console.error("(*^^*)エラァお前どこのコードじゃボケェ");
                        }
                    }
                }
        }
       
        }             
            
        
      
      
      
        /*  if ($(this).hasClass("404")) {
            $('.catalog').text('見つかりませんでした。')
            console.log('一致するキーワードが見つかりません。')
        }*/

        
    });

    //---------------検索機能ここまで-----------------

    //タイトルとお内容にtagArrayとtagObjectIndexを作成
    //このとき、タグ一つに何個もタイトルが来るから、オブジェクトの中に配列を格納
    /*var tagobjectIndex = {
        tag1 : [
            "note1",
            "note2",
            "note3"
        ],
        tag2:"note3",
        tag3:[
            "note4"
        ]
    }
    */





    //---------------ソート機能ここから-----------------
    //ABC順
    $('.cquarter-circle-1 .abcBtn').click(function(){
        $('.catalog').removeClass('filterDisplay')//階層機能のやつ（消さないで）
        $('.addFolder-wrapper').removeClass('addFolderShow')
        $(".addMemo").show()
        $(".searcher").val("")
        $('.searcher').prop('disabled', false)
        $('.addFolder-wrapper').hide()
        $('.addFolderBtn').removeClass('addFolderBtnShow')
        $('.folderBtn').html(
            '<img src="images/folder_white.svg" width="30px" height="30px">'
        )
        sortMenuCompact()
        //
        // Men do kus ai.
        $('.catalog').text("");
        $('.catalogPopup').text("");
        console.log('ABC順に並べ替えます')//["い","か","あ","テストた"]
        var titleABCArray = Array.from(titleArray)
        titleABCArray.sort()//["タイトル１","タイトル2","タイトル３","テストた"]
        titleABCArray.reverse()
        for (let i = 0; i < titleABCArray.length; i++) {
            var titleDoc = titleABCArray[i];
                var resultCookieData = titleObjectIndex[titleDoc]
                var resultNoteContent = $.cookie(resultCookieData)
                
                if(resultNoteContent !== undefined){

                 var numberData = String(resultNoteContent.number);
                 var titleData = resultNoteContent.title;
                 var tagData = resultNoteContent.tags;
                 var contentData = resultNoteContent.content;
                 //console.log(numberData+"と"+titleData+"と"+tagData+"と"+contentData)
                 randomOR = false
                makeDataDOM(numberData,titleData,tagData,contentData)
                }else{
                    console.error('( ͡° ͜ʖ ͡°)');
                }
                
        }
        
    })
    //新しい順
    $('.cquarter-circle-3 .newBtn').click(function(){
        $('.addFolder-wrapper').hide()
        $('.searcher').prop('disabled', false)
        $(".searcher").val("")
        $(".addMemo").show()
        $('.addFolder-wrapper').removeClass('addFolderShow')
        $('.addFolderBtn').removeClass('addFolderBtnShow')
        $('.catalog').removeClass('filterDisplay')//階層機能のやつ（消さないで）
        $('.folderBtn').html(
            '<img src="images/folder_white.svg" width="30px" height="30px">'
        )
        sortMenuCompact()
        //
        // Men do kus ai.
        toggleRandom = false
        showCookieData()
        toggleRandom = true
        
    })
    //古い順
    $('.cquarter-circle-4 .oldBtn').click(function(){
        $('.addFolder-wrapper').hide()
        $(".addMemo").show()
        $('.searcher').prop('disabled', false)
        $(".searcher").val("")
        $('.addFolder-wrapper').removeClass('addFolderShow')
        $('.addFolderBtn').removeClass('addFolderBtnShow')
        $('.catalog').removeClass('filterDisplay')//階層機能のやつ（消さないで）
        $('.folderBtn').html(
            '<img src="images/folder_white.svg" width="30px" height="30px">'
        )
        sortMenuCompact()
        //
        // Men do kus ai.
        $('.catalog').text("");
        $('.catalogPopup').text("");
        console.log('古いに並べ替えます')
        var titleOldArray = Array.from(titleArray);
        titleOldArray.reverse();
        for (let i = 0; i < titleOldArray.length; i++) {
            var titleDoc = titleOldArray[i];
                var resultCookieData = titleObjectIndex[titleDoc]
                var resultNoteContent = $.cookie(resultCookieData)
                
                if(resultNoteContent !== undefined){

                 var numberData = String(resultNoteContent.number);
                 var titleData = resultNoteContent.title;
                 var tagData = resultNoteContent.tags;
                 var contentData = resultNoteContent.content;
                 //console.log(numberData+"と"+titleData+"と"+tagData+"と"+contentData)
                 randomOR = false
                makeDataDOM(numberData,titleData,tagData,contentData)
                }else{
                    console.error('( ͡° ͜ʖ ͡°)');
                }
            
        
        }
    })
    //---------------ソート機能ここまで-----------------








    

    

    //---------------階層機能表示-----------------
    //トップの階層をクリックした時
    var deleteFileType  = 0
    var folderObject = $.cookie("folderObjectCookie")
    var folderObjectName = $.cookie("folderObjectNameCookie")
    var deleteFolderList = $.cookie("deleteFolderListCookie")
    $('.folderBtn').click(function(){
        if(!($('.catalog').hasClass('filterDisplay'))){
            //トップフォルダ表示
            //カタログの初期化
            $('.catalog').text("");
            $('.catalogPopup').text("");
            $(".addMemo").hide()
            $('.searcher').prop('disabled', true)
            $(this).html(
                '<img src="images/back_white.svg" width="30px" height="30px">'
            )
            folderShow(folderObject,"","",true);
            $('.catalog').addClass('filterDisplay')
            $('.addFolder-wrapper').show()
            $(".searcher").val("Top://")
        }else{
            //戻るボタン
            $('.catalog').text("");
            $('.catalogPopup').text("");

            var backCurrentId = $(this).attr('id')
            
            if (backCurrentId == undefined) {
                folderShow(folderObject,"","",true);
            }else{
                var backToId = backCurrentId.slice(0,-2)
                var backToApeId = backToId
                var hierarchies = [];
                var sliceFolderId = backToId
                sliceFolderId = sliceFolderId + "--"
                for (let i = 0; i < backToId.length / 2; i++) {
                    sliceFolderId = sliceFolderId.slice(0,-2)
                    console.log(sliceFolderId)
                    hierarchies.push(sliceFolderId)
                }
                hierarchies.filter(Boolean)
                hierarchies.reverse()
                var getObjectData = folderObject
                for (let i = 0; i < hierarchies.length; i++) {
                    getObjectData = getObjectData[hierarchies[i]]
                }
                var getObjectName = ""
                for (let i = 0; i    < hierarchies.length; i++) {
                    getObjectName += '["'+hierarchies[i]+'"]'
                }
                console.log("backToApeId:"+backToApeId)
                folderShow(getObjectData,getObjectName,backToApeId,false) 
                $(this).removeAttr("id");
                $(this).attr("id",backToApeId)

                var currentDirectory = ($(".searcher").val()).slice(6)
                var separateIndex = backToApeId.length / 2
                var beforDirectoryArray = currentDirectory.split('/', separateIndex)
                var consistDirectory =  "Top://"
                console.log(beforDirectoryArray)
                for (let i = 0; i < beforDirectoryArray.length; i++) {
                    var beforeDirectory = beforDirectoryArray[i];
                    consistDirectory = consistDirectory + beforeDirectory + "/"
                }
                $(".searcher").val(consistDirectory)
            }
            
        }
    })
    $(document).on('click','.folderWrapper',function(){//フォルダボタンをクリックしたときのデータの引き渡し
        var getFolderId = $(this).attr('id');
        
        //カタログの初期化
        
        
        
        $('.folderBtn').attr('id',getFolderId)
        var hierarchies = [];
        var sliceFolderId = getFolderId
        sliceFolderId = sliceFolderId + "--"
        for (let i = 0; i < getFolderId.length / 2; i++) {
            sliceFolderId = sliceFolderId.slice(0,-2)
            console.log(sliceFolderId)
            hierarchies.push(sliceFolderId)
        }
        hierarchies.filter(Boolean)
        hierarchies.reverse()
        var getObjectData = folderObject
        for (let i = 0; i < hierarchies.length; i++) {
            getObjectData = getObjectData[hierarchies[i]]
        }
        var getObjectName = ""
        for (let i = 0; i    < hierarchies.length; i++) {
            getObjectName += '["'+hierarchies[i]+'"]'
        }
        getFolderId = $(this).attr('id');
        if (deleteFileType == 1) {//削除
            deleteFolderList.push(getFolderId)
            $(this).fadeOut(300)
            deleteFileType = 0
            $.cookie("deleteFolderListCookie",deleteFolderList)
        }else{//開く
            $('.catalog').text("");
            $('.catalogPopup').text("");
            folderShow(getObjectData,getObjectName,getFolderId,false) 
            var addDirectryLetter = folderObjectName[getFolderId]
            var beforeDirectoryLetter = $('.searcher').val()
            $('.searcher').val(beforeDirectoryLetter + addDirectryLetter + "/ ") 
        }
        
    })


    function folderShow (objectData,objectValue,objectName,first){//フォルダをクリックした時の表示
        var i = 0
        while (i <  Object.keys(objectData).length) {
            var objectPro = "F" + i //objectProperty
            if (first == true) {
                var folderGetNote = objectData[objectPro]
            }else{
                objectPro = objectName + objectPro
                eval(
                    "var folderGetNote = folderObject" + objectValue + '["' + objectPro + '"]' 
                )
            }

            
                
            
            console.log(folderGetNote)
             if ($.type(folderGetNote)=="string") {
                 var folderCookieContent = $.cookie(folderGetNote)
 
                 if (folderCookieContent !== undefined) {
                    if ($.inArray(objectPro, deleteFolderList) !== -1) {
                        var makeAppearance = $("<div>",{
                            "class":"appearanceWrapper",
                            "id":objectPro
                        })
                        $('.catalog').prepend(makeAppearance)
                        makeAppearance.hide()
                    }else{
                        var folderNumber = folderCookieContent.number;
                        var folderTitle = folderCookieContent.title;
                        var folderTags = folderCookieContent.tags;
                        var folderContent = folderCookieContent.content;
                        randomOR = false
                        makeDataDOM(folderNumber,folderTitle,folderTags,folderContent)
                    }
                     
                 } 
             }else{
                 var folderName = folderObjectName[objectPro]
                 var folderIMG = $('<img src ="/images/folder.svg" class="folderIMG">')
                 var folderMake = $('<div>',{
                     "class":"folderWrapper",
                     "id": objectPro
                 })
                

                 var folderH1Make = $('<h2>',{
                     "class": folderTitle
                 })
                 folderH1Make.html(folderName)
                 $('.catalog').prepend(folderMake)
                 folderMake.append(folderIMG)
                 folderMake.append(folderH1Make)
                 if ($.inArray(objectPro, deleteFolderList) !== -1) {
                    folderMake.hide()
                }
             }
            
            
             
             i++;
         }
    }
    //---------------階層機能表示ここまで-----------------

    //今考えていること
    //新しくメモをつくr時じゃなくて、フォルダーを表示しているときにタイトルを検索して、でた物をそのディレクトリに追加する感じで行こうかと思ってる。
    //フォルダーも同じ感じで、inputをうまく駆使して、パソコンの新しいフォルダみたいにできたらいいなと考えている。
    //検索するときはタイトルだけ。
    //できればしたからスワイプしたらタイトル追加とか、フォルダ追加とかが出てきて欲しい。（完了）
    //フォルダ追加ボタンは細長く、棒のような感じで。（もうできた）
    
    //↑こっちの方が、新規作成と編集画面のどっちものコードを書かなくてすみそうなのと、表示がだるくなくなりそう。
    //8/6/（金） 0:32:20
     //---------------階層機能追加ここから-----------------
     var startY;
     var endY;
     $(document).on('mousedown',function(event){
        startY = event.screenY;
        endY = event.screenY;
     })
     $('.catalog').on('mousedown',function(){
        if (!($(this).hasClass('sorting'))) {
            sortMenuCompact()
        }
     })
     $(document).on('mouseup',function(event){
         endY = event.screenY;
         if (endY - startY < -100) {
             console.log("上方向にスワイプしました。")
             $('.addFolder-wrapper').addClass('addFolderShow')
             $('.addFolderBtn').addClass('addFolderBtnShow')
             $('.addFileInput').focus()
             $('.searchResult').text("")
             $('.addFileInput').val("")
         }else{
            $('.addFolder-wrapper').removeClass('addFolderShow')
            $('.addFolderBtn').removeClass('addFolderBtnShow')
         }
     })
     $('.folder-description').click(function(){
        console.log("folder-descriptionがクリックされました。")
        $('.addFolder-wrapper').toggleClass('addFolderShow')
        $('.addFolderBtn').addClass('addFolderBtnShow')
        $('.addFileInput').focus()
        $('.searchResult').text("")
        $('.addFileInput').val("")
    })
    var addfolderGetNote;
     $('.addFolderBtn').click(function(event){
        event.stopPropagation();
          var getFolderNumber = $('.folderBtn').attr('id')
          if (getFolderNumber !== undefined && getFolderNumber.length == 18 ) {
              alert('フォルダーは直下9個までです')
              return;
          }
         if (getFolderNumber == undefined) {//トップフォルダ
            var newFolderValue =  "F" + Object.keys(folderObject).length
            console.log("newFolderVale::" + newFolderValue)
            $(this).addClass("topDirectory")
         }else{//そのほかのディレクトリ
            var addHierarchies = [];
            var sliceFolderId = getFolderNumber
            var premisedFolderId = getFolderNumber
            if (getFolderNumber.length !== 2) {
                console.log(getFolderNumber.length)
                sliceFolderId = sliceFolderId + "--"
                for (let i = 0; i < getFolderNumber.length / 2; i++) {
                    sliceFolderId = sliceFolderId.slice(0,-2)
                    addHierarchies.push(sliceFolderId)
                }
                addHierarchies.filter(Boolean)
                addHierarchies.reverse()
                console.log(addHierarchies)
                var addObject = ""
                for (let i = 0; i    < addHierarchies.length; i++) {
                    addObject += '["'+addHierarchies[i]+'"]'
                }
                console.log(addObject)
                eval(
                    "addfolderGetNote = folderObject" + addObject
                )
            }else{
                var addObject = ""
                addfolderGetNote = folderObject[getFolderNumber]
                console.log("folderObject["+getFolderNumber+"]")
            }
            
           
            
            var newFolderValue =  premisedFolderId  + "F" + Object.keys(addfolderGetNote).length
             console.log(newFolderValue)
        }
            var makeNewFolder = $('<div>',{
                "class":"folderWrapper",
                "id": newFolderValue
            })
            var folderIMG = $('<img src ="/images/folder.svg" class="folderIMG">')
            
            var folderH1Make = $('<input>',{
                type:"text" ,
                "class":"newFolderInputDefault",
                "id":newFolderValue,
                css:{
                    outline: "none",
                    fontSize:"2.3em"
                }
            })
            $('.catalog').prepend(makeNewFolder)
            makeNewFolder.append(folderIMG)
            makeNewFolder.append(folderH1Make)
            
            folderH1Make.val("新しいフォルダー")
            folderH1Make.focus()
            folderH1Make.select()
     })
     $(document).on('click','.newFolderInputDefault',function(event) {
        event.stopPropagation()
     })
     
     $(document).on('keypress','.newFolderInputDefault',function(e) {
        if(e.key == "Enter"){
            var getIdFromInput = $(this).attr('id')
            var getNewFolderName = $(this).val();
            if (getNewFolderName.length > 30) {
                alert("フォルダー名は30字以内にしてください。")
                var sharpingLetterIndex = 30 - getnewFolderName
                var sharpenedFolderName = getnewFolderName.slice(0,sharpingLetterIndex)
                $(this).val(sharpenedFolderName)
                $(this).select()
                return;
            }
            console.log("Fx::"+getIdFromInput)
            $(this).remove()
            var folderConcludeNote = $('<h2>',{
                "id":getNewFolderName
            })
            folderConcludeNote.text(getNewFolderName)
            $("#" + getIdFromInput).append(folderConcludeNote)
            folderObjectName[getIdFromInput] = getNewFolderName
            if ($('.addFolderBtn').hasClass("topDirectory")) {
                folderObject[getIdFromInput] ={}
                $('.addFolderBtn').removeClass("topDirectory")
            }else{
                addfolderGetNote[getIdFromInput] ={}
            }
            console.log(folderObjectName)
            console.log(folderObject)
            $.cookie('folderObjectNameCookie',folderObjectName, { expires: 730 })
            $.cookie('folderObjectCookie',folderObject, { expires: 730 })
            console.log($.cookie("folderObjectNameCookie"))
            return;
        }
    })
     $('.addFileInput').click(function (event){
        event.stopPropagation()
     })
     $('.addFileInput').on("input", function () {
        $('.searchResult').text("")
        var titleSearchKey = $(this).val()
        titleSearchKey = titleSearchKey.toLowerCase()
        titleSearchKey = kanaToHira(titleSearchKey)
        for (let i = 0; i < titleArray.length; i++) {//["タイトル１","タイトル2","タイトル３","テストた"]
            var fileTitle = titleArray[i];
            if(fileTitle.indexOf(titleSearchKey.normalize()) == 0){
                console.log(fileTitle)
                var makeTitle = $('<p></p>',{
                    "class":"smallTitle",
                    "id":fileTitle
                })
                makeTitle.html(fileTitle)
                $('.searchResult').append(makeTitle)
            }
        }
    });
    $(document).on("click",'.smallTitle',function(event){
        event.stopPropagation()
        //catalogに追加
        var getTitleIdFromSmall = $(this).attr("id");
        var getNoteFromTitleSmall = titleObjectIndex[getTitleIdFromSmall]
        console.log(getNoteFromTitleSmall)
        var getNoteContentFromTitle = $.cookie(getNoteFromTitleSmall)

        if (getNoteContentFromTitle !== undefined) {
            var folderNumber = getNoteContentFromTitle.number;
            var folderTitle = getNoteContentFromTitle.title;
            var folderTags = getNoteContentFromTitle.tags;
            var folderContent = getNoteContentFromTitle.content;
            randomOR = false
            makeDataDOM(folderNumber,folderTitle,folderTags,folderContent)
        }else{
            console.error("＼＼\\٩( 'ω' )و //／／")
        }

        //データに追加
        var getFileName = $('.folderBtn').attr('id')
        if (getFileName == undefined) {//トップフォルダ
            var newFileValue =  "F" + Object.keys(folderObject).length
            folderObject[newFileValue] = getNoteFromTitleSmall
        }else{
            var addHierarchies = [];
            var sliceFileId = getFileName
            var premisedFileId = getFileName
            sliceFileId = sliceFileId + "--"
            for (let i = 0; i < getFileName.length / 2; i++) {
                
                sliceFileId = sliceFileId.slice(0,-2)
                addHierarchies.push(sliceFileId)
            }
            addHierarchies.filter(Boolean)
            addHierarchies.reverse()
            console.log(addHierarchies)
            var addObject = ""
            for (let i = 0; i    < addHierarchies.length; i++) {
                addObject += '["'+addHierarchies[i]+'"]'
            }
            eval(
                "var addFileGetNote = folderObject" + addObject
            )
            var newFileValue =  premisedFileId  + "F" + Object.keys(addFileGetNote).length
            addFileGetNote[newFileValue] = getNoteFromTitleSmall
        }
        $.cookie('folderObjectNameCookie',folderObjectName, { expires: 730 })
        $.cookie('folderObjectCookie',folderObject, { expires: 730 })
        $('folderObjectCookie',folderObject)//Cookieに保存
        
    })
     //---------------階層機能追加ここまで-----------------


    //-----------------階層機能削除ここから-----------------
    
    //0 開く
    //1 フォルダ
    //2 ファイル
    $('.settingBtn').click(function(){
        $('#settingFolder').dialog({
            
            modal:true,
            title:"各フォルダ削除",//背景はしろ
            buttons: {
              "閉じる": function() {
                  $(this).dialog("close");
                  deleteFileType = 0
                },
              "フォルダを削除": function() {
                  $(this).dialog("close");
                  deleteFileType = 1
                },
              "ファイルを削除":function(){
                  $(this).dialog("close");
                  deleteFileType = 2
                },
            }
        });
        console.log(deleteFileType)

    })
    
    //-----------------階層機能削除ここまで-----------------







    //-----------------動きをつけるだけのコード-----------------
    $('.addMemo').click(function(){
        $(this).animate({
            opacity:"0.5",
            right:"40px",
            bottom:"55px"
        },200);
        $(this).css({
            boxShadow:"none"
        })
    })
    $('.cquarter-circle-2').click(function() {
        $(this).toggleClass('sorting')
        $('.sortMenuBtn').text("Menu")
        if ($(this).hasClass('sorting')) {
            
            $('.cquarter-circle-2').animate({
            opacity:"0.8",
            cursor:"auto",
            width:"50px",
            height:"50px",
            right:"25px",
            top:"25px"
            },100)
           
            $('button.sortMenuBtn').html(
                '<img src="images/menu_Black.svg" width="25px" height="25px">'
            )
            if ($(window).width() > 900) {
                $('.sortMenuBtn').animate({
                    opacity:"0.8",
                    left:"7px",
                    top:"10px"
                },100)
            }else{
                $('.sortMenuBtn').animate({
                    opacity:"0.8",
                    left:"-1px",
                    top:"10px"
                },100)
            }
            
            $('.cquarter-circle-2').css({
                background:"white",
                border:"1px solid black"
            })

            $('.sortMenuBtn').css({
                color:"black",
                cursor:"auto" 
            })
            var rightMath = Math.sqrt(3)*80 + "px"
            $('.cquarter-circle-5').animate({
                top:"160px"
            },100)
            $('.cquarter-circle-5').addClass('sort-put-shadow')
            $('.cquarter-circle-1').animate({
                right:"160px"
            },100)
            $('.cquarter-circle-1').addClass('sort-put-shadow')
            $('.cquarter-circle-4').animate({
                right: rightMath,
                top:"80px"
            },100)
            $('.cquarter-circle-4').addClass('sort-put-shadow')
            $('.cquarter-circle-3').animate({
                right:"80px",
                top:rightMath
            },100)
            $('.cquarter-circle-3').addClass('sort-put-shadow')

        }else{
            sortMenuCompact()
        }
            
    })
        
    function sortMenuCompact (){
        $('.cquarter-circle-2').removeClass('sorting')
        $('button.sortMenuBtn').html(
            '<img src="images/menu_White.svg" width="50px" height="50px">'
        )
        $('.cquarter-circle-2').css({
            background:"#5b96ee",
            border:"none"
        })
        
        
        if ($(window).width() > 900) {
            $('.sortMenuBtn').animate({
                opacity:"1",
                left:"17px",
                top:"23px"
            },100)
            $('.cquarter-circle-2').animate({
                opacity:"1",
                cursor:"pointer",
                width:"100px",
                height:"100px",
                right:"0px",
                top:"0px"
            },100)
        }else{
            $('.sortMenuBtn').animate({
                opacity:"1",
                left:"3px",
                top:"11.5px"
            },100)
            $('.cquarter-circle-2').animate({
                opacity:"1",
                cursor:"pointer",
                width:"80px",
                height:"80px",
                right:"0px",
                top:"0px"
            },100)
        }
        $('.sortMenuBtn').css({
            cursor:"pointer"

        },100)
        $('.cquarter-circle-1').animate({
            right:"20px",
            top:"20px"
        },100)
        $('.cquarter-circle-1').removeClass('sort-put-shadow')
        $('.cquarter-circle-4').animate({
            right:"20px",
            top:"20px"
        },100)
        $('.cquarter-circle-4').removeClass('sort-put-shadow')
        $('.cquarter-circle-3').animate({
            right:"20px",
            top:"20px"
        },100)
        $('.cquarter-circle-3').removeClass('sort-put-shadow')
        $('.cquarter-circle-5').animate({
            right:"20px",
            top:"20px"
        },100)
        $('.cquarter-circle-5').removeClass('sort-put-shadow')
    }
    //-----------------動きをつけるだけここまで-----------------


    //--------------functionを設定する枠（ライブ配信）--------
    function kanaToHira(str) {
      return str.replace(/[\u30a1-\u30f6]/g, function(match) {
            var chr = match.charCodeAt(0) - 0x60;
            return String.fromCharCode(chr);
            });
    }
    function makeRandomWrapper (){
        if (randomOR == true) {
            var RandomWrapperDOM = $('<div>',{
                "class":"randomShow"
            })
            $('.catalog').prepend(RandomWrapperDOM)
        }
    }
    function randomAppeared (){
        if (randomOR == true) {
            var randomNumber;
            var randomLastNumber = -1;
            
            for (let i = 0; i < 3; i++) {
                randomNumber = Math.floor(Math.random() *  titleArray.length )
                
                if (randomLastNumber == randomNumber) {
                    i -= 1 ;
                }else {
                    
                    randomLastNumber = randomNumber;
                    
                    var ranDomCookieName = "note" + randomNumber;
                    var randomNoteContent = $.cookie(ranDomCookieName)//おぶじぇくと["プロパティ"]
                if(randomNoteContent !== undefined){
    
                 var numberData = String(randomNoteContent.number);
                 var titleData = randomNoteContent.title;
                 var tagData = randomNoteContent.tags;
                 var contentData = randomNoteContent.content;
                makeDataDOM(numberData,titleData,tagData,contentData);
                 
                 
                }else{
                    i -= 1
                }
                }
                
            }
        }
    }
    function settingTitleData (){
        var gotExsistArray = $.cookie('existCookie');//["note1","note2","not3"]
        //cookieから存在するnoteを格納していくぅ！
        if (gotExsistArray !== undefined) {
            for (let i = 0; i < gotExsistArray.length; i++) {

                var notes = gotExsistArray[i];
                var noteContent = $.cookie(notes);
                //変数titleDataに存在するtitleを配列として代入する
     
                if(noteContent !== undefined){
                 var titleData = noteContent.title;
     
                 titleData = kanaToHira(titleData);//あいうに変換
                 titleData = titleData.toLowerCase(); // 小文字に変換
     
                 titleArray.push(titleData)
                 titleObjectIndex[titleData] = notes;
                 //notes -> note1
                 //titleData -> タイトル１
                }
             }
        }
    }
    //--------------functionを設定する枠（ライブ配信）--------

    //↑jQueryの
});//これは宣言の閉じタグなので消さない。
//↓普通のJavaScript


//-------サンプル（参考）--------
//以下でCookieをjson化する
//$.cookie.json = true;

//sampleHashという連想配列をsample_cookieというCookieにjson形式で保存する
//let sampleHash = {fruit: 'apple', vegetable: 'tomato'};
//$.cookie('sample_cookie', sampleHash);

//json形式で保存された'sample_cookie'をパースして連想配列に戻す
//let parsedHash = $.cookie('sample_cookie');
//console.log(parsedHash.fruit);
// apple


//発生しているバグ供（殺処分予定）
/*
・検索で、1を検索した後に消すと、増殖する。
・メニューのアイコンが押した瞬間一瞬だけ飛ぶ



*/
