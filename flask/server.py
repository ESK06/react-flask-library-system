from flask import Flask, request, jsonify
from flask_cors import CORS
from bson.objectid import ObjectId
import pymongo
import bcrypt

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = 'secretkey'
jwt = JWTManager(app)

client=pymongo.MongoClient('localhost',27017)
db=client.library


CORS(app, origins=['http://localhost:3000'])

class User:
    def __init__(self):
        self.users = db.users

    #user login
    def login(self):
        alldata = request.get_json()
        email = alldata.get('email')
        password = alldata.get('password')

        useremail=self.users.find_one({'email':email})

        if useremail:
            if bcrypt.checkpw(password.encode('utf-8'), useremail['password']):

                access_token = create_access_token(identity=email)
                return jsonify({'login': True, 'access_token': access_token}), 200
            
            else:
                return jsonify({'login': False, 'message': 'wrong password'}), 401
        
        else:
            return jsonify({'login': False, 'message': 'wrong email and password'}), 401
        
    
    #user signup
    def signup(self):
        alldata = request.get_json()
        name = alldata.get('name')
        email = alldata.get('email')
        password = alldata.get('password')
        
        try:
            passwordhash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            self.users.insert_one({'name':name,'email':email,'password':passwordhash})
            return jsonify({'message': 'success'}), 201
        except pymongo.errors.DuplicateKeyError:
            return jsonify({'message': 'email exists'})
        
   
    #get user name
    @jwt_required()
    def getUserName(self):
        user = get_jwt_identity()
        name = self.users.find_one({'email': user})
        if name:
            return jsonify({'name':name.get('name')}), 200
        
    
    #update user name
    @jwt_required()
    def UpdateUsername(self):
        user = get_jwt_identity()
        usernames = request.get_json()
        newusername = usernames.get('newusername')

        userExists = self.users.find_one({'email':user})
        if userExists:
            newValue = {'$set': {'name': newusername}}
            self.users.find_one_and_update({'_id': ObjectId(userExists['_id'])}, newValue)
            return jsonify({'message': 'success'}), 200
        
    
    #update password
    @jwt_required()
    def UpdatePassword(self):
        data = request.get_json()
        user = get_jwt_identity()
        oldpassword = data.get('oldpassword')
        newpassword = data.get('newpassword')

        userExists = self.users.find_one({'email':user})

        if userExists:
            if bcrypt.checkpw(oldpassword.encode('utf-8'), userExists['password']):
                newpasswordhash = bcrypt.hashpw(newpassword.encode('utf-8'), bcrypt.gensalt())
                newValue = {'$set': {'password': newpasswordhash}}
                self.users.find_one_and_update({'_id': ObjectId(userExists['_id'])}, newValue)
                return jsonify({'message': 'success'}), 200
            else:
                return jsonify({'message': 'unsuccessful'})



class Book:
    def __init__(self):
        self.users = db.users
        self.books = db.books
        self.wishlists = db.wishlists
        self.bookRequests = db.bookrequests


    #book search
    @jwt_required()
    def search(self):
        title = request.args.get('query', '')
        #print(title)
        booklst =[]

        lst = self.books.find({'title':{'$regex':title,'$options':'i'}})
        for item in lst:
            booklst.append({'id': str(item.get('_id')),
                            'title': item.get('title')})
        if booklst:
            return jsonify(booklst), 200
        else:
            return jsonify(booklst)
        
    
    #get all books
    @jwt_required()
    def browseBooks(self):
        allbooks = self.books.find({}, {'title':1})
        booklst = []
        for book in allbooks:
            booklst.append({'id': str(book['_id']),'title': book['title']})

        return jsonify(booklst)
    

    #get book details
    @jwt_required()
    def bookDetails(self, id):
        book = self.books.find_one({'_id': ObjectId(id)})
        if book:
            return jsonify({'title':book.get('title'),
                            'author':book.get('author'),
                            'genre':book.get('genre'),
                            'year':book.get('year'),
                            'description':book.get('description')})
        else:
            return jsonify({'message': 'unsuccessful'})
        
    
    #get user book requests
    @jwt_required()
    def getRequests(self):
        user = get_jwt_identity()
        userinfo = self.users.find_one({'email':user})
        userId = userinfo['_id']

        allRequests = self.bookRequests.find({'user_id': userId})
        reqs = []
        for userRequest in allRequests:
            reqs.append({'title':userRequest.get('title'),
                        'book_id':userRequest.get('book_id')})
        
        return jsonify(reqs), 200
    

    #add book request
    @jwt_required()
    def requestBook(self, id):
        user = get_jwt_identity()
        userinfo = self.users.find_one({'email':user})
        userId = userinfo['_id']
        info = request.get_json()
        title = info.get('title')

        self.bookRequests.insert_one({'user_id': userId,'book_id':id, 'title':title})
        return jsonify({'message': 'success'}), 200
    

    #check book is requested by user
    @jwt_required()
    def checkRequest(self, id):
        user = get_jwt_identity()
        userinfo = self.users.find_one({'email':user})
        userId = userinfo['_id']

        requestExists = self.bookRequests.find_one({'user_id':userId, 'book_id':id})
        if requestExists:
            return jsonify({'message': 'exists'}), 400
        else:
            return jsonify({'message': 'not found'})
        
    
    #get user wishilst
    @jwt_required()
    def getWishlist(self):
        user = get_jwt_identity()
        userinfo = self.users.find_one({'email':user})
        userId = userinfo['_id']

        wishlistBooks = self.wishlists.find({'user_id':userId})
        books = []
        for data in wishlistBooks:
            books.append({'title':data.get('title'),
                        'book_id':data.get('book_id')})
                
        
        return jsonify(books), 200
    

    #check book is wishlisted by user
    @jwt_required()
    def checkWishlist(self, id):
        user = get_jwt_identity()
        userinfo = self.users.find_one({'email':user})
        userId = userinfo['_id']

        wishlistExists = self.wishlists.find_one({'user_id':userId, 'book_id':id})
        if wishlistExists:
            return jsonify({'message': 'exists'}), 400
        else:
            return jsonify({'message': 'not found'})
        
    
    #add book to wishlist
    @jwt_required()
    def addtoWishlist(self, id):
        info = request.get_json()
        title = info.get('title')

        user = get_jwt_identity()
        userinfo = self.users.find_one({'email':user})
        userId = userinfo['_id']

        self.wishlists.insert_one({'user_id':userId, 'book_id':id, 'title':title})
        return jsonify({'message': 'success'}), 200
    
    
    #remove book from wishlist
    @jwt_required()
    def reomovefromWishlist(self, id):
        user = get_jwt_identity()
        userinfo = self.users.find_one({'email':user})
        userId = userinfo['_id']

        self.wishlists.delete_one({'user_id':userId, 'book_id':id})
        return jsonify({'message': 'success'}), 200



useroptions = User()
app.add_url_rule('/login/', view_func=useroptions.login, methods=['POST'])
app.add_url_rule('/signup/', view_func=useroptions.signup, methods=['POST'])
app.add_url_rule('/username/get/', view_func=useroptions.getUserName, methods=['GET'])
app.add_url_rule('/username/update/', view_func=useroptions.UpdateUsername, methods=['POST'])
app.add_url_rule('/password/update/', view_func=useroptions.UpdatePassword, methods=['POST'])


bookoptions = Book()
app.add_url_rule('/search/protected/', view_func=bookoptions.search, methods=['GET'])
app.add_url_rule('/browse/protected/', view_func=bookoptions.browseBooks, methods=['GET'])
app.add_url_rule('/browse/protected/<id>', view_func=bookoptions.bookDetails, methods=['GET'])
app.add_url_rule('/request/protected/', view_func=bookoptions.getRequests, methods=['GET'])
app.add_url_rule('/request/protected/add/<id>', view_func=bookoptions.requestBook, methods=['POST'])
app.add_url_rule('/request/protected/check/<id>', view_func=bookoptions.checkRequest, methods=['GET'])
app.add_url_rule('/wishlist/protected/', view_func=bookoptions.getWishlist, methods=['GET'])
app.add_url_rule('/wishlist/protected/check/<id>', view_func=bookoptions.checkWishlist, methods=['GET'])
app.add_url_rule('/wishlist/protected/add/<id>', view_func=bookoptions.addtoWishlist, methods=['POST'])
app.add_url_rule('/wishlist/protected/remove/<id>', view_func=bookoptions.reomovefromWishlist, methods=['POST'])


if __name__ == '__main__':
    app.run(debug=True)