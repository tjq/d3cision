function d3cision() {
  
  // defaults (don't forget: have functions)
  var textnodesize = "12px"; 
  var debug = false;

  // internals
  var lknfctr = 0.70;
  var sep = 10;
  var textposition = {x : 0, y : 0};
  var margin = { top: 25, right: 25, bottom: 25, left: 25 };
  var rectpars = { width: 8 };
  var colors = ["red", "blue"];

  function chart(selection) {
    
    selection.each(function(data, i) {
      
      var width = this.offsetWidth - margin.left - margin.right;
      var height = this.offsetHeight - margin.top - margin.bottom;
      var d3cisionid = makeid();
      var colorscale = "s";

      if(debug){
        console.log("data", data);
        console.log("d3cisionid", d3cisionid);
        window.data = data;
      }

      var svg = d3.select(this).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom);
        
      var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
      // declares a tree layout and assigns the size
      var treemap = d3.tree()
        .size([width, height]);
      
      //  assigns the data to a hierarchy using parent-child relationships
      var nodes = d3.hierarchy(data);
      
      // maps the node data to the tree layout
      nodes = treemap(nodes);
      
      // adds the links between the nodes
      var links =  g.selectAll(".link2")
        .data(nodes.descendants().slice(1))
        .enter();
        
      var links1 = links
        .append("path")
        .attr("d3cisionid", d3cisionid)
        .attr("class", "d3cision-link")
        .attr("stroke", "#eee")
        .attr("fill", "none")
        .attr("stroke-width", "2px")
        .attr("nodeid", function(d){ return d.data.name; })
        .attr("d", function(d) {
          
          var yd = (1 - lknfctr) * d.y + lknfctr * d.parent.y;
          var curve = getlknfctr(d.x, d.y, d.parent.x, d.parent.y, yd);
          
          return curve;
          
        });
        
      var link2 = links
        .append("path")
        .attr("stroke", "#ccc")
        .attr("d3cisionid", d3cisionid)
        .attr("fill", "none")
        .attr("stroke-width", "2px")
        .attr("nodeid", function(d){ return d.data.name; })
        .attr("d", function(d) {
          
          sig = ((d.data.side == "left") ? 1 : -1);
          sep2 = sep * sig

          var yd = (1 - lknfctr) * d.y + lknfctr * d.parent.y;
          var curve = getlknfctr(d.x, d.y, d.parent.x, d.parent.y + sep, yd + sep);
          
          return curve;
          
        });
      
      // adds each node as a group
      var node = g.selectAll(".node")
          .data(nodes.descendants())
        .enter().append("g")
          .attr("class", function(d) {
            return "node" + (d.children ? " node--internal" : " node--leaf");
          })
          .attr("nodeid", function(d){ return d.data.name; })
          .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
          });
      
      // adds the rects to the node
      /*
      var rects = node.append("rect")
        .attr("d3cisionid", d3cisionid)
        .attr("fill", "#ccc")
        .attr("nodeid", function(d){ return d.data.name; })
        .attr("x", function(d){
          x = -rectpars.width/2 + sep * ((d.data.side == "left") ? 1 : -1);
          x = (d.data.name == "1") ? -rectpars.width/2 : x;
          // x = -3 - sep;
          return x;
        })
        .attr("y", -sep)
        .attr("width", rectpars.width)
        .attr("height", 10);
      */
      
      // adds the text to the node
      var texts = node.append("text")
        .attr("d3cisionid", d3cisionid)
        .attr("dy", ".35em")
        //.attr("y", function(d) { return d.children ? -20 : 20; })
        .attr("class", "d3cision-node-text")
        .attr("font-size", textnodesize)
        .attr("fill", "#999")
        .attr("y", -20)
        .attr("x", function(d){
          var textanchor = (d.data.side == "left") ? "end" : "left";
          var x = 5 * ((textanchor == "end") ? -1 : 1);
          return x;
        })
        //.style("text-anchor", "middle")
        .style("text-anchor", function(d){
          var textanchor = (d.data.side == "left") ? "end" : "left";
          return textanchor;
        })
        .text(function(d) { return d.data.rule + " (" + d.data.name + ")"; });
        
      // text rule 
      var textrule = g.selectAll(".text")
        .attr("d3cisionid", d3cisionid)
        .data([textposition]).enter()
        .append("text")
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; })
        .text("");
        
        
      function mouseover(d) {
        console.log(d.data.name);
        /*d3.selectAll("[d3cisionid='ynppv']").selectAll("[nodeid='4']");*/
      }
      
      //links.on('mouseover', mouseover);
      //rects.on('mouseover', mouseover);
      

    });
    
  }

  chart.textnodesize = function(_) {
    if (!arguments.length) return textnodesize;
    textnodesize = _;
    return chart;    
  };
  
  chart.debug = function(_) {
    if (!arguments.length) return debug;
    debug = _;
    return chart;    
  };  
  
  return chart;
  
}



// Auxiliar functions
// http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeid() {
  return Math.random().toString(36).substr(2, 5);
}

function getlknfctr(x, y, xp, yp, yd) {
  
   curve =  "M" + x + "," + y
     + " " + x  + "," + yd
     + " " + xp + "," + yp;
     
    return curve;
  
}

