transform
=========

##jquery transform css3 plugin

###介绍
  开始的时候看着https://github.com/rstacruz/jquery.transit  
  蛮有意思的，大概功能就是在jquery里面操纵css3,  
  很久之前写的，代码有点乱，主要是css3这种高大上的东西平常写点后台根本用不上，  
  不过大致的思路还是完成了，也实现了很多功能  
###用法

		$('#box').transform({ x : 100 })  
            .transform({ origin : "100%,10px", rotate : 100 },  
                    2000, function(){  
                        console.log("rotate complete");  
                    })  
            .transform({ perspective : 100, rotateX : 180 }, function(){  
                        console.log("rotateX complete");  
                    })  
            .transform({ y : 100 }, 2000)  
            .transform({ scale : 2}, 2000, 'ease1')  
            .transform({ scale : 1}, 2000, 'ease1', function(){  
                console.log("scale complete");  
            });  
            
            
		$('#box').transform({ perspective : 1000, rotate3d : "1,1,1,180" }, function(){  
                            console.log('one');  
                        })  
            .transform('clear');  
            .transform({ translate3d : 100}, function(){  
                            console.log('two');  
                        })  
            .transform('clear');  
            .transform({ scale3d : '2,3,4' }, function(){  
                            console.log('three');  
                        });  
            .transform({ translate3d : 200 }, function(){  
                            console.log('four');  
                        });  
            .transform({ perspective : 1000, rotate3d : "1,1,1,180"}, function(){  
                            console.log('five');  
                        })  
            .transform({ delay:1000 , translate3d : 100 }, function(){  
                            console.log('six');  
                        })  
            .transform({ scale3d : '2,3,4'}, function(){  
                            console.log('seven');  
                        })  
            .transform({ translate3d : 200}, function(){  
                            console.log('eight');  
                        });  
    在哪两个html文件里有demo,还有一些函数
    //动画停止
    $('#box').transform('stop');
    //动画开始
    $('#box').transform('start');
    //清理以前动画
    $("#box").transform('clear');

