'use strict'

const Model = use('Model')
const Hash = use('Hash')

class User extends Model {
  // Como se fosse o construtor da classe
  static boot () {
    super.boot()

    // Adicionando um Hook que será executada antes de salvar o usuário no banco
    // -> O Hook é uma função que é executada automáticamente
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  addresses () {
    return this.hasMany('App/Models/UserAddress')
  }

  // Criando um relacionamento com a tabela de Token
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  projects () {
    return this.hasMany('App/Models/Project')
  }

  tasks () {
    return this.hasMany('App/Models/Task')
  }

  static get traits () {
    return [
      '@provider:Adonis/Acl/HasRole',
      '@provider:Adonis/Acl/HasPermission'
    ]
  }
}

module.exports = User
