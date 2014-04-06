$(function(){
  $.fn.hasAttr = function(name) {
     return this.attr(name) !== undefined;
  };
  Alive = {
    init: function(){
      this.theAnswerToLifeTheUniverseAndEverything = 42;
      this.radius = 200;
      this.radial = $("#radial_container");
      this.scene = $('.scene');
      this.gun = $('.gun');
      this.shoot = $('.shoot');
      this.roll = $('.roll');
      this.holeInput = $('.hole-input'),
      this.startButton = $('.start.btn');
      this.msgArea = $('.message-area');
      this.turnCount = 0;
      this.shortArray = [];
      this.animSpeed = 10;
      this.makeRadialMenu();
      this.events();
      Alive.onInit();
    },
    makeRadialMenu: function(){
      this.radial.radmenu({
        listClass: 'gun', // the list class to look within for items
        itemClass: 'bullet', // the items - NOTE: the HTML inside the item is copied into the menu item
        radius: Alive.radius, // radius
        animSpeed:Alive.animSpeed, // animation speed in millis
        centerX: Alive.radius, // the center x axis offset
        centerY: Alive.radius, // the center y axis offset
        selectEvent: "click", // the select event (click)
        angleOffset: 0 // in degrees
      }).radmenu("show");
      this.bullet = $('.radial_div_item');
    },
    events: function(){
      Alive.onRoll();
      Alive.onBulletClick();
      Alive.onHoleInput();
    },
    onRoll: function () {
      Alive.roll.on('click', function(){
        var i = 0;
        var times = 1.1;
        while(i<Alive.theAnswerToLifeTheUniverseAndEverything){
          Alive.radial.radmenu('next');
          Alive.radial.radmenu('opts').animSpeed *= times;
          i++;
        }
        Alive.radial.radmenu('opts').animSpeed = 10;
        Alive.msg("You survived. Try with a different order!")
        Alive.holeInput.focus();
      });
    },
    msg: function(text,delay){
      Alive.msgArea.html(text).css({
        opacity : 0
      }).animate({
        opacity : 1
      },250);
      if(delay != 0){
        Alive.msgArea.delay(delay || 6000).animate({
          opacity : 0
        },250,"", function(){

        });
      }
    },
    onInit:function(){
      Alive.msg("Set number of holes and insert some bullets to see the probabilities.",0)
    },
    checkStartButton:function(){
      if(!Alive.startButton.hasAttr('disabled')){
        if(Alive.startButton.is(':visible')){
          Alive.startButton.off('click');
          Alive.startButton.on('click', Alive.startTheGame)
        }
      }else{
        Alive.pauseTheGame();
      }
    },
    startTheGame: function(){
      Alive.msg("I'll shoot for once.<br>Then it is your turn.",0)
      Alive.startButton.fadeOut(200);
      setTimeout(function(){
        Alive.countBullets();
        Alive.msg("I managed to survive.<br>Your turn.<br>Shoot or roll?",0)
        Alive.radial.radmenu('opts').animSpeed = 500;
        Alive.radial.radmenu('next');
        Alive.turnCount++;
        Alive.radial.radmenu('opts').animSpeed = 10;
        Alive.shoot.fadeIn(200);
        Alive.roll.fadeIn(200);
      },2000);
    },
    pauseTheGame: function(){
      Alive.startButton.fadeIn(200);
      Alive.shoot.fadeOut(200);
      Alive.roll.fadeOut(200);
    },
    onBulletClick: function(){
      Alive.bullet.on('click', function () {
        $(this).toggleClass('full');
        Alive.countBullets();
      });
    },
    onHoleInput: function(){
      Alive.holeInput.on('keyup', function(){
        Alive.startButton.fadeIn(200);
        var v = $(this).val();
        Alive.gun.html('');
        for (var i = 0; i < v; i++) {
          Alive.gun.append('<li class="bullet" style="display:none"></li>');
        };
        Alive.makeRadialMenu();
        Alive.onBulletClick();
        Alive.onInit();
        Alive.countBullets();
      });
    },
    countBullets: function(){
      Alive.shortArray = [];
      $.each(Alive.bullet, function(){
        Alive.shortArray.push(($(this).hasClass('full')) ? 1 : 0)
      });
      Alive.makeCalculations(Alive.shortArray);
    },
    makeCalculations: function(arr){
      var empty = 0,
          full = 0,
          probRoll, probShot,
          msg1, msg2,
          arrLen = arr.length,
          result = "Probability of survival: <br>",
          i;

      for(i=0; i<arrLen;i++){
        (arr[i] == 0) ? empty++ : full++;
      }
      if(full>0){
        Alive.startButton.removeAttr('disabled');
      }else{
        Alive.startButton.attr('disabled', 'disabled');
      }
      if(empty == 0){
        Alive.startButton.attr('disabled', 'disabled');
        Alive.msg("At least one empty hole",0);
      }else{
        Alive.onInit();
      }
      Alive.checkStartButton();
      probRoll = Alive.probabilityOnRoll(empty,full)*100;
      probShot = Alive.probabilityOnShoot(arr,empty,full)*100;
      msg1 = "Spin & Shot: %" + probRoll.toString().substr(0,8);
      msg2 = "Immediate shot: %" + probShot.toString().substr(0,8);
      if(probRoll > probShot) {
        result += "<strong>" + msg1 +"</strong><br>" + msg2;
      } else if(probRoll < probShot){
        result += msg1 + "<br><strong>"+ msg2 + "</strong>"
      } else {
        result += msg1 + "<br>" + msg2;
      }
      Alive.msg(result,0);
    },
    probabilityOnRoll: function(empty,full){
      return empty/(empty+full);
    },
    probabilityOnShoot: function(arr,empty,full){
      var t = Alive.turnCount + 1,
        i = 0,
        j = 0,
        l = arr.length,
        condition = "",
        s = 0; //number of survives
      var cndt;
        for(j=0;j<=t;j++){ condition += "(arr[(i+"+j+")%l]) == 0 && " }
        condition+="1";
      $.each(arr,function(){
        cndt = eval("{" + condition + "}");
        if(cndt){ s++ }
        i++;
      });
      return s/empty;
    }
  };

  Alive.init();
});