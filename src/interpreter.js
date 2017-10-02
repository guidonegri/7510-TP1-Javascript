var Interpreter = function () {
  
	var Fact = function (name, params) {
	    this.name = name;
	    this.params = params;
	    this.getName = function () { return this.name; }
	    this.getParams = function () { return this.params; }
	}

	var Rule = function (name, params, facts) {
	    this.name = name;
	    this.params = params;
	    this.facts = facts;
	    this.getName = function () { return this.name; }
	    this.getParams = function () { return this.params; }
	    this.getFacts = function () { return this.facts; }
	}
  
	var db_facts = [];
	var db_rules = [];
  
	var fact_pattern = /(.*)\((.*)\)\./;
	var rule_pattern = /(.*)\((.*)\) :- (.*)\./;

	this.parseDB = function (db) {
		let count = 0;
		for (i = 0; i < db.length; i++) { 
			if (rule_pattern.test(db[i]) ) {
				let rule = new Rule("pepe", ["x", "y"]);
				db_rules.push(rule);
				count++;
			} else if (fact_pattern.test(db[i]) ) {
				let fact = new Fact("pepe", ["x", "y"]);
					db_facts.push(fact);
					count++;			
				} else {
					alert(db[i]);
				}
			}
		if (count != db.length) {console.log("Error in the DB."); return null;}
		else database = db;
	}

	this.checkQuery = function (query) {
		//return database[0];
		return true;
	}

}

module.exports = Interpreter;
