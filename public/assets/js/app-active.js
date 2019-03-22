 function formatRows(main, prefer, common) {
    return '<tr><td style="width:25%;">'+main+'</td>' +
           '<td style="width:50%;">'+prefer+'</td>' +
           '<td style="width:25%;">'+common+'</td>' +
           ' <td class="text-right">'+
           '<div class="btn-group btn-hspace">'+
            '<button type="button" data-toggle="dropdown" class="btn btn-default dropdown-toggle">Open <span class="icon-dropdown mdi mdi-chevron-down"></span></button>'+
           ' <ul role="menu" class="dropdown-menu pull-right">'+
              '<li><a href="#" onclick="deleteRow(this)">Удалить</a></li>'+
              '<li><a href="#">Another action</a></li>'+
              '<li><a href="#">Something else here</a></li>'+
             '<li class="divider"></li>'+
             '<li><a href="#">Separated link</a></li>'+
           '</ul>'+
         '</div>'+
        '</td>';
  };

  function deleteRow(trash) {
    $(trash).closest('tr').remove();
  };
  
  function addRow() {
    var main = $('.addMain').val();
    var preferred = $('.addPrefer').val();
    var common = $('.addCommon').val();
    $(formatRows(main,preferred,common)).insertAfter('#addRow');
    //$(input).val('');  
    var table = $('#addmenutableup').tableToJSON();
    alert(JSON.stringify(table));
  }
  
  $('#addBtn').click(function()  {
    addRow();
  });
  