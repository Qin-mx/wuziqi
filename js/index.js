$(function() {
    var canvasS = 600;
    var row = 15;
    var blockS = canvasS / row;
    var d = 3;
    var flag = true;
    var all = {}; //字典
    var step = 1;
    var Radius = blockS / 2 * 0.8;
    var ctx = document.querySelector('#canvas').getContext('2d'); //画笔对象
    $('#z_play').get(0).play();
    $('#z_play').get(0).onended=function(){
       this.play();
    }
    $('#canvas').get(0).height = canvasS;
    $('#canvas').get(0).width = canvasS;
    var r = function() {
        return Math.PI / 180 * 360;
    }
    var draw = function() {
        var off = blockS / 2 + 0.5;
        var lw = canvasS - blockS;
    		// 列
        ctx.save();
        ctx.beginPath();
        ctx.translate(off, off);
        for (var i = 0; i < row; i++) {
            ctx.moveTo(0, 0);
            ctx.lineTo(lw, 0);
            ctx.translate(0, blockS);
        }
        ctx.stroke();
        ctx.closePath();
        ctx.restore();

        //行
        ctx.save();
        ctx.beginPath();
        ctx.translate(off, off);
        for (var i = 0; i < row; i++) {
            ctx.moveTo(0, 0)
            ctx.lineTo(0, lw);
            ctx.translate(blockS, 0);
        }
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        //画圆
        ctx.save();
        ctx.beginPath();
        ctx.translate(7.5 * blockS, 7.5 * blockS);
        ctx.arc(0, 0, d, 0, r());
        ctx.fill();
        ctx.closePath();
        ctx.restore();

        var dian = [3.5 * blockS, 11.5 * blockS];
        for (var i = 0; i < dian.length; i++) {
            for (var j = 0; j < dian.length; j++) {
                ctx.save();
                ctx.beginPath();
                ctx.translate(dian[i], dian[j]);
                ctx.arc(0, 0, d, 0, r());
                ctx.fill();
                ctx.closePath();
                ctx.restore();
            }
        }       
    }
    draw();
    //放棋
    var lazi = function(chess) {
            ctx.save();
            ctx.beginPath();
            ctx.translate((chess.x + 0.5) * blockS, (chess.y + 0.5) * blockS);
            ctx.arc(0, 0, Radius, 0, r());
            if (chess.color === 1) {
                var qizi = ctx.createRadialGradient(0, -10, 0, 0, 0, Radius);
                qizi.addColorStop(0.1, '#666');
                qizi.addColorStop(0.3, '#000');
                qizi.addColorStop(1, '#000');
                ctx.fillStyle = qizi;
                $('#b_play').get(0).play();
            } else {
                var qizi = ctx.createRadialGradient(0, 0, 1, 0, 0, Radius);
                qizi.addColorStop(0.1, '#fff');
                qizi.addColorStop(1, '#ccc');
                ctx.fillStyle = qizi;
                $('#w_play').get(0).play();
            }
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
        //点击lazi
    $('.start').on('click',function(){
    $('#canvas').on('click', function(e) {
        var x = Math.floor(e.offsetX / blockS);
        var y = Math.floor(e.offsetY / blockS);
        if (all[x + '-' + y]) {
            return
        };
        if (flag) {
            var chess = {
                x: x,
                y: y,
                color: 1,
                step: step
            };
            all[x + '-' + y] = chess;
            lazi(chess);
             if( panduan(chess) ){
		        $('.cartel').show().find('#tishi').text('黑赢');
		      };
            flag = false;
        } else {
            var chess = {
                x: x,
                y: y,
                color: 0,
                step: step
            };
            all[x + '-' + y] = chess;
            lazi(chess);
             if( panduan(chess) ){
	        $('.cartel').show().find('#tishi').text('白赢');
	      };
            flag = true;
        }
        step += 1;
    })
    })
    //判断
    var panduan = function(chess) {
        var shuju = {};
        $.each(all, function(i, v) {
            if (v.color == chess.color) {
                shuju[i] = v;
            }
        })
        var shu = 1,
            hang = 1,
            zuoxie = 1,
            youxie = 1;
        var tx, ty;
        tx = chess.x;
        ty = chess.y //fubiao
            //判断shu的输赢
        while (shuju[tx + '-' + (ty + 1)]) {
            shu++;
            ty++;
        }
        tx = chess.x;
        ty = chess.y;
        while (shuju[tx + '-' + (ty - 1)]) {
            shu++;
            ty--;
        }
        //判断hang
        tx = chess.x;
        ty = chess.y;
        while (shuju[(tx - 1) + '-' + ty]) {
            hang++;
            tx--;
        }
        tx = chess.x;
        ty = chess.y;
        while (shuju[(tx + 1) + '-' + ty]) {
            hang++;
            tx++;
        }
        //判断youxie
        tx = chess.x;
        ty = chess.y;
        while (shuju[(tx + 1) + '-' + (ty - 1)]) {
            youxie++;
            ty--;
            tx++;
        }
        tx = chess.x;
        ty = chess.y;
        while (shuju[(tx - 1)+ '-' + (ty + 1) ]) {
            youxie++;
            ty++;
            tx--;
        }
        //panduan zuoxie{
        tx = chess.x;
        ty = chess.y;
        while (shuju[(tx - 1) + '-' + (ty - 1)]) {
            zuoxie++;
            ty--;
            tx--;
        }
        tx = chess.x;
        ty = chess.y;
        while (shuju[ (tx + 1)+ '-' +(ty + 1) ]) {
            zuoxie++;
            ty++;
            tx++;
        }
        if (shu >= 5 || hang >= 5 || zuoxie >= 5 || youxie >= 5) {      
            return true;
        }
    }


 $("#restart").on('click',function(){
    $('.cartel').hide();
    ctx.clearRect(0,0,600,600);
    draw();
    flag = true;
    all = {};
    step = 1;
  })

 $('#qipu').on('click',function(){
    $('.cartel').hide();
    $('#save').show();
    $('.fanhui').show();
      $('#canvas').off('click');
    ctx.save();
    ctx.font = "20px consolas";
    for( var i in all){
      if( all[i].color === 1){
          ctx.fillStyle = '#fff';
      }else{
        ctx.fillStyle = 'black';
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(all[i].step,
        (all[i].x+0.5)*blockS,
        (all[i].y+0.5)*blockS);
    }
    ctx.restore();
   var image = $('#canvas').get(0).toDataURL('image/jpg',1);
    $('#save').attr('href',image);
    $('#save').attr('download','qipu.png');
  })

  $('.tips').on('click',false);
  $('#close').on('click',function(){
      $('.cartel').hide();
       ctx.clearRect(0,0,600,600);
        draw();
        flag = true;
        all = {};
        step = 1;
  })
  $('.cartel').on('click',function(){
    $(this).hide();
     ctx.clearRect(0,0,600,600);
      draw();
      flag = true;
      all = {};
      step = 1;
  })
   $('.fanhui').on('click',function(){
    $('.cartel').hide();
  })
   $('.sy').on('click',function(){
  console.log(1)
  if( $('#z_play').get(0).volume!==0){
      $('#b_play').get(0).volume=0; 
      $('#w_play').get(0).volume=0; 
      $('#z_play').get(0).volume=0; 
      $(this).removeClass('sy');
      $(this).addClass('sy1');
    }else{
       $('#b_play').get(0).volume=1; 
      $('#w_play').get(0).volume=1; 
       $('#z_play').get(0).volume=1;
      $(this).removeClass('sy1');
       $(this).addClass('sy');
    }
})
})
