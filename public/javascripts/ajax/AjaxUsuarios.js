var Usuarios={//objeto
  adicionar:function(){//funcion o propiedad del objeto
    // alert('llegue adicionar')
    $.ajax({
      url:'/ModalAddUser',
      type:'post',
      success:function(res){
        $('#contendor-modales').html(res)
        $('#addUser').modal('show');
        $('#FormAddUser').formValidation({

        }).on('success.form.fv', function(e){
          e.preventDefault();
          adicionar();
        })
        function adicionar(){
          // if(confirm("Seguro de Adicionar Usuario")){
            $('#FormAddUser').ajaxSubmit({
              success:function(resp){
                $('contendor').html(resp)
              },
              error:function(err){
                alert("error al envio por ajax");
              }
            })
          // }
        }
      },
      error:function(){

      }
    })
  }
}
