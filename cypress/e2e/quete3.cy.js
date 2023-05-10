

describe ('Vérifier les requetes HTTP notes ', () => {
    const token = 'c94d4519ae3143c38ea42dacca98512e5325f4afc7f140a0a73c603421b4002d';
    
    it ('créer une note dans une categorie valide ', () => {
        cy.request ({
             method: 'POST',
             url: '/notes',
             headers: {
                "x-auth-token": token
             },
             body: {
                'title':'Note1',
                'description':'This is my first note',
                'category': 'Work',
             }
         }).then((response) => {
             
             expect(response.status).to.eq(200)
             expect(response.body.message).to.eq('Note successfully created')
             expect(response.body.data).to.ownProperty('id')
             expect(response.body.data).to.ownProperty('title')
             expect(response.body.data).to.ownProperty('description')
             expect(response.body.data).to.ownProperty('category')
         })
     })

    it ('recuperer toutes les notes', () => {
       cy.request ({
            method: 'GET',
            url: '/notes',
            headers: {
               "x-auth-token": token
            }
        }).then((response) => {
           
            expect(response.status).to.eq(200)
            expect(response.body.message).to.eq('Notes successfully retrieved')
            expect(response.body.data).to.be.an('array')
        })
    })

    it ('recuperer une note par son ID  (ID valide)', () => {
        cy.request ({
            method: 'GET',
            url: '/notes/645bfc8df2ef1702126acf89',
            headers: {
               "x-auth-token": token,
            }
    
        }).then((response) => {
            
             expect(response.status).to.eq(200)
             expect(response.body.message).to.eq('Note successfully retrieved')
             expect(response.body.data).to.ownProperty('id')
             expect(response.body.data).to.ownProperty('title')
             expect(response.body.data).to.ownProperty('description')
             expect(response.body.data).to.ownProperty('category')
         })
     })
 
     it ('recuperer une note par son ID  (ID invalide)', () => {
        cy.request ({
            method: 'GET',
            url: '/notes/645bfc8df2ef1702126acf85',
            failOnStatusCode:false,
            headers: {
               "x-auth-token": token,
            }
        }).then((response) => {
            
             expect(response.status).to.eq(404)
             expect(response.body.message).to.eq('No note was found with the provided ID, Maybe it was deleted')
            
         })
     })

     it ('recuperer une note par son ID  (requete non authorisée)', () => {
        cy.request ({
            method: 'GET',
            url: '/notes/645bfc8df2ef1702126acf89',
            failOnStatusCode:false,
            headers: {
                "x-auth-token": 'e3265a9906c0643d0854a9865a',
             }
        }).then((response) => {
             expect(response.status).to.eq(401) 
         })
     })


     it ('Modifier completed status (champs obligatoire) et la description de note', () => {
        cy.request ({
            method: 'PATCH',
            url: '/notes/645bfc8df2ef1702126acf89',
            headers: {
                "x-auth-token": token,
             },
            body: {
                'completed': true,
                'description': 'this is my updated note'
             }

        }).then((response) => {
             expect(response.status).to.eq(200)
             expect(response.body.data.completed).to.be.true
            
         })
     })


     it ('Modifier que la description', () => {
        cy.request ({
            method: 'PATCH',
            url: '/notes/645bfc8df2ef1702126acf89',
            failOnStatusCode: false,
            headers: {
                "x-auth-token": token,
             },
            body: {
                'description': 'this is my updated note (again)'
             }

        }).then((response) => {
             expect(response.status).to.eq(400)
            
         })
     })


     it ('créer une note à partir de fichier JSON   ', () => {
        cy.fixture('notes.json').then (myNotes => {
        cy.request ({
             method: 'POST',
             url: '/notes',
             headers: {
                "x-auth-token": token
             },
             body:myNotes[0]
            })
             
         }).then((response) => {
             
             expect(response.status).to.eq(200)
             expect(response.body.message).to.eq('Note successfully created')
             expect(response.body.data).to.ownProperty('id')
             expect(response.body.data).to.ownProperty('title')
             expect(response.body.data).to.ownProperty('description')
             expect(response.body.data).to.ownProperty('category')
         })
     })
     
     it ('créer une note à partir de fichier JSON avec categorie invalide', () => {
        cy.fixture('notes.json').then (myNotes => {
        cy.request ({
            failOnStatusCode: false,
             method: 'POST',
             url: '/notes',
             headers: {
                "x-auth-token": token
             },
             body:myNotes[2]
            })
             
         }).then((response) => {
             
             expect(response.status).to.eq(400)
             expect(response.body.message).to.eq('Category must be one of the categories: Home, Work, Personal')
             
             
         })
     })
     

})



