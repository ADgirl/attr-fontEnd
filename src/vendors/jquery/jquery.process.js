/*
 * 分数
 */
(function($){
    $.fn.extend({
        toCanvas:function(options){
            var defaults={
                canvaswidth:500,
                canvasheight:500,
                percent:50,
                radius:105,
                lineWidth:32
            }
            var options = $.extend(defaults, options);

            // var _this=$(this).selector.substring(1);
            var canvas = document.getElementById(options.id);
            var ctx = canvas.getContext("2d");
            var circleX = options.canvaswidth/2;
            var circleY = options.canvasheight/2+30;
            var image = new Image();
            


            var process = 0.0;  //进度
            var circleLoading;  //定时器
             (function(){
                image.onload=function(){
                    ctx.drawImage(image,circleX,circleY);
                }
                image.src = "/static/images/default/Comparison-page_Pointer_zero.png";
               circleLoading = window.setInterval(function () {loading();}, 20);
             })();

            function loading() {
              //清除canvas内容
              ctx.clearRect(0, 0, circleX * 2, circleY * 2);

              //文字
              initfont(circleX, circleY,process);

              //圆形
              circle(circleX, circleY, options.radius);
                     
              //圆弧
              sector(circleX, circleY, options.radius, Math.PI*2/3, process);

              //指针
              point(circleX, circleY,process);
                     
              //控制结束时动画的速度
              if (process / options.percent > 0.90) {
                  process += 0.30;
               } else if (process / options.percent > 0.80) {
                  process += 0.55;
               } else if (process / options.percent > 0.70) {
                  process += 0.75;
               } else {
                  process += 1.0;
               }
               if (process >= options.percent) {
                  //中间的字
                  ctx.clearRect(circleX-40, circleY-60, 80,35);  
                  initfont(circleX, circleY,options.percent);
                  clearInterval(circleLoading);
                  return;
               }
            }
            //文字
            function initfont(cx,cy,process){
              ctx.shadowBlur = 0;
              ctx.shadowOffsetX =0;
              ctx.shadowOffsetY =0;

               //中间字(分数)
              ctx.font ='bold 24px Arial';
              ctx.textAlign = 'center';
              ctx.fillStyle = '#45CFFE';
              ctx.fillText(parseFloat(process).toFixed(2) + '%', cx, cy-30); 

              //相似度
              ctx.font = '16px Arial';
              ctx.textAlign = 'center';
              ctx.fillStyle = '#45CFFE';
              ctx.fillText("相似度", cx, cy+50);

              //标尺字
              ctx.font ='bold 14px Arial';
              ctx.textAlign = 'center';
              ctx.fillStyle = '#999';
              ctx.fillText("0", 15, options.canvasheight-15);
              ctx.fillText("25", 10, cy-45);
              ctx.fillText("50", cx, 10);
              ctx.fillText("75",options.canvaswidth-15, cy-45);
              ctx.fillText("100", options.canvaswidth-15, options.canvasheight-15); 
            }
            //画圆
            function circle(cx, cy, r) {
              ctx.beginPath();
              //ctx.moveTo(cx + r, cy);
              ctx.shadowOffsetX = 1; // 阴影Y轴偏移
              ctx.shadowOffsetY = 1; // 阴影X轴偏移
              ctx.shadowBlur = 15; // 模糊尺寸
              ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // 颜色

              ctx.lineWidth = options.lineWidth;
              ctx.strokeStyle = '#5F9CB9';
              ctx.arc(cx, cy, r, Math.PI*(5/6), Math.PI * (1/6));
              ctx.stroke();
            }

            //画弧线
            function sector(cx, cy, r, startAngle, endAngle, anti) {
              ctx.beginPath();
              //ctx.moveTo(cx, cy + r); // 从圆形底部开始画
              ctx.lineWidth = options.lineWidth+8;
              
              // 渐变色 - 可自定义
              var linGrad = ctx.createLinearGradient(
                circleX-options.radius-options.lineWidth, circleY, circleX+options.radius+options.lineWidth, circleY
              );
              linGrad.addColorStop(0.0, '#0988C3');
              linGrad.addColorStop(0.5, '#34B4F1');
              linGrad.addColorStop(1.0, '#37D3F4');
              ctx.strokeStyle =linGrad;

              //圆弧
              ctx.arc(cx, cy, r ,(Math.PI*(5/6)),(Math.PI*(5/6)) + endAngle/100 * (Math.PI*(4/3)),false);
              ctx.stroke();
            }

            //指针旋转
            function point(cx, cy, angle){
              ctx.save();
              ctx.translate(cx, cy);
              //ctx.rotate((angle*(2.4)) * Math.PI / 180);
              ctx.rotate(Math.PI*(1/10)+angle/100 * (Math.PI*(4/3))) ;
              ctx.translate(-cx, -cy);
              ctx.drawImage(image, cx - image.width / 2, cy - image.height / 2);
              ctx.restore();
            }
        }          
    });
})(jQuery);