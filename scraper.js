var client = require('http-api-client');
var sqlite3 = require("sqlite3").verbose();
const sqliteJSON = require('sqlite-json');
var d3 = require("d3");

// Open a database handle
var db = new sqlite3.Database("data.sqlite");
var p=0; var p2=0;

db.run("DELETE FROM data");

var currentCount =  "2017-01-01T00:00:00.008329+03:00"

//db.each("SELECT dateModified FROM data ORDER BY dateModified DESC LIMIT 1", function(err, timeStart) {
      
	//var currentCount = timeStart.dateModified
	console.log("старт: "+currentCount); 
	//var end  = formatTime(new Date());
	//console.log("конец: "+end);

//db.run("DELETE FROM data");
	
function piv(){  
p++;
client.request({url: 'https://public.api.openprocurement.org/api/2.3/plans?offset='+currentCount})
		.then(function (data) {
						 
		
			var dataset = data.getJSON().data;
			
			currentCount = data.getJSON().next_page.offset;			
			console.log(currentCount)
			
			return dataset;
	
		})	
		.then(function (dataset) {	
		
			dataset.forEach(function(item) {
				client.request({url: 'https://public.api.openprocurement.org/api/0/plans/'+item.id})
					.then(function (data) {
			


if(data.getJSON().data.budget.year =="2017"){
	
db.serialize(function() {
	db.run("CREATE TABLE IF NOT EXISTS data (dateModified TEXT,name TEXT,amount INT,procurementMethod TEXT)");
	var statement = db.prepare("INSERT INTO data VALUES (?,?,?,?)");
	statement.run(item.dateModified,data.getJSON().data.procuringEntity.name,data.getJSON().data.budget.amount,data.getJSON().data.tender.procurementMethod);
	statement.finalize();
});

}//year
				
				})
					.catch(function  (error) {
						console.log("error_detale")
						
					});  
				});
		
		})
		.then(function () {	
		if (p<1){piv ();}		
		else {
			console.log("stop")
				p=0;
				p2++;
				console.log(p2)
			setTimeout(function() {
			
				if (p2 < 1) {
					piv ();
				}
				else {
					
///////////////////////////////////////////////////////////////////////////////////////////////////		

					
						
const exporter = sqliteJSON(db);
					
exporter.json('SELECT name,procurementMethod,amount FROM data', function (err, json) {
						
var nest=d3.nest()
 .key(function(d) {return d.name;})
.key(function(d) {return d.procurementMethod;})
.rollup(function(v) { return {
	count: v.length, 
	total: d3.sum(v, function(d) { return d.amount; })
}; })
.entries(JSON.parse(json.replace(/limited/g, "open")));
						

					
nest.forEach(function(item) {

	//console.log(JSON.stringify(item.values))	
	console.log(item.values[0].value.key)
	
db.run("DELETE FROM data_nest1");
	
db.serialize(function() {
db.run("CREATE TABLE IF NOT EXISTS data_nest1 (item TEXT,countNo INT,countOpen INT,totalNo INT,totalOpen INT)");
var statement = db.prepare("INSERT INTO data_nest1 VALUES (?,?,?,?,?)");

if(item.values[0].value.key=="open"){
	//statement.run(item.key,item.values[0].value.count,item.values[1].value.count,item.values[0].value.total,item.values[1].value.total); 
	console.log("open")
}
if(item.values[0].value.key==""){
	console.log("no")
}
statement.finalize();
});//db
	
})//nest						

});//exporter		

					
					
///////////////////////////////////////////////////////////////////////////////////////////////////
					console.log("STOP");
				     }
				}, 5000);
		}		 
							
		})
		.catch( function (error) {
		console.log("error")
		piv ();
		});   
		
		
			

}

piv ();	
 
//});
