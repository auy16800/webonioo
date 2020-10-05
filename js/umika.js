// js文件结束处是没有daodu 分号的。若几个js连在一起时，2个js连接处会发生语法上的混淆。开头加内;用于分隔，可以避免多文件压缩在一起时引起的错误。

;window.onload = function(){
    function $(idName){
        return document.getElementById(idName);
    }
    var gamestart = $("gamestart");
    var start = $("start");
    var discriable = $("discriable");
    var cls1 = $("cls1");
    var game = $("game");
    var operta = $("operta");
    var des = $("des");
    var discriable = $("discriable");
    var sel = $("sel");
    var close = $("close");
    //游戏截面高度                             ????? +   字母边界⚪的
    var gameHeight = getStyle(gamestart,"height");
    //宽度
    var gameWidth = getStyle(gamestart,"width");

    //定时器
    var c,letterEles ;


    // 点击开始游戏，隐藏游戏开始界面，显示进入游戏界面
    start.onclick = function(){
        gamestart.style.display = "none";
        game.style.display = "block";
    }

    //  ???如果有不支持拿到类名s的document方法
    if(!document.getElementsByClassName){
        document.getElementsByClassName = function(className){
            var all = document.all;
            var arr = [];
            for(var i = 0 ; i<arr.length ; i++){
                arr.push(all[i]);
            }
            return arr;

        }
    }

    // event事件委托：即是，一个事件本要绑定到某个元素上，然而却绑定到了该元素的父（或祖先）元素上，利用事件冒泡原理，触发执行效果。
    operta.onclick = function(event){
        var e = event || window.event;
        var target = e.target || e.srcElement;

        // 退出的事件  如果目标元素的类名 == exit
        if(target.className == 'exit'){
            gamestart.style.display = "block";
            game.style.display = "none";
        }
        //设置事件
        if(target.className == 'set'){
            sel.style.display = "block";
        }
        //进入界面之后的开始 == 暂停
        if(target.className == 'st'){
            //点击开始后，变成暂停
            target.innerHTML = target.innerHTML == "开始" ? "暂停" : "开始";
            
            //游戏的暂停
            if(target.innerHTML == '开始'){
                //暂停后字母应该停止掉落
                clearInterval(c);
                c = undefined;
                //清除所有字母元素上的定时器
                clearAllLetters();
            }else{
                //如果定时器存在，不开启定时器
                    if(c){
                        return;
                    }       
                //游戏的开始
                //单位时间内字母掉落数量的定时器
                c = setInterval(function() {
                    //创建一个span标签
                    creatLetter();
                    //获取所有的字母
                    letterEles = document.getElementsByClassName("active");
                },800);
                //暂停之后的开始游戏
                gamestart();
            }
        }

          
    }
    // 说明的显示事件
    discriable.onclick = function(){
        
        des.style.display = "block";
    }
    //说明的关闭事件 鼠标经过
    des.onmouseover = function(){
        cls1.style.display = "block";
    }
    //说明的关闭事件 鼠标离开
    des.onmouseout = function(){
        cls1.style.display = "none";
    }
    //关闭提示内容
    cls1.onclick = function(){
        des.style.display = "none";
    }

    //点击设置，选择游戏难度
    sel.onmouseover = function(){
        close.style.display = "block";
    }
    close.onclick = function(){
        sel.style.display = "none";
    }

    // 封装——获取到元素使用样式的最终值
                    //元素 属性
    function getStyle(el,attr){
        //获取的结果变量
        var res = null;
        if(el.currentStyle){
            res = el.currentStyle[attr];
        }else{
            res = window.getComputedStyle(el,null)[attr];
        }
        return parseFloat(res);
    }

    //运动函数：元素的运动， 元素运动的最终值，元素的哪个属性运动
    //控制字母掉落的速度的定时器   每个字母上都有定时器
    function sportMove(el,finalVal,attr){
        //字母下落速度
        var speed = 1;
        el.timer = setInterval(function() {
            //当前元素的运动值
            var moveVal = getStyle(el,attr);
            if(moveVal == finalVal){
                clearInterval(el.timer)
                //删除元素
                game.removeChild(el);
            }else{
                el.style[attr] = moveVal + speed + 'px';
            }
        }, 10);
    }

    // sportMove(letter,gameHeight,"top")
    //创建span 字母
    function creatLetter(){
        var span = document.createElement("span");
        span.className = 'active';
        span.innerHTML = randomLetter();
        span.style.left = Math.floor(Math.random() * (gameWidth - 30)) + 'px';
        span.style.background = randomBG16();
        //添加到游戏界面里
        game.appendChild(span);
        sportMove(span,gameHeight,"top");
    }

    //生成16进制随机颜色值
    function randomBG16(){
        var str  = '0123456789abcdef';
        var colorVal = '#';
        for(var i = 0 ; i < 6; i++){
            colorVal += str.charAt(Math.floor(Math.random() * str.length));
        }
        return colorVal;
    }

    //随机产生字母
    function randomLetter(){
        var str = 'abcdefghijklmnopqrstuvwxyz';//小写
        str += str.toUpperCase();
        return str.charAt(Math.floor(Math.random() * str.length ))
    }

    //清除掉所有字母所在元素的定时器
    function clearAllLetters(){
        for(var i = 0 ; i < letterEles.length; i++){
            clearInterval(letterEles[i].timer);
            letterEles.timer = undefined;
        }
    }

    //暂停之后的开始游戏
    function gamestart(){
        for(var i = 0 ; i < letterEles.length; i++){
            sportMove(letterEles[i],gameHeight,'top');
        }
    }

}
