(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['report-template.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<!DOCTYPE html>\n<html>\n  <head>\n"
    + ((stack1 = container.invokePartial(partials["head.hbs"],depth0,{"name":"head.hbs","data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "  </head>\n  <body>\n"
    + ((stack1 = container.invokePartial(partials["implementation.hbs"],depth0,{"name":"implementation.hbs","data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials["report.hbs"],depth0,{"name":"report.hbs","data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "  </body>\n</html>\n";
},"usePartial":true,"useData":true});
})();