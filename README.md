## PDX Roasters

...

## Getting Started

Django is a great framework, but requires several steps to get a development
site running on your computer. If you're running OS X these instructions should
serve you well:

    # Install pip
    $ sudo easy_install pip

    # Install virtualenv
    $ sudo pip install virtualenv

    # Create a new virtual environment for the project
    $ virtualenv django-pdxroasters

    # Activate the virtual environment
    $ cd django-pdxroasters
    $ source bin/activate

    # Check out the project source
    $ git clone git@github.com:twaddington/pdxroasters.git src

    # Create a local settings file
    $ cp src/site/pdxroasters/settings_local.py.sample src/site/pdxroasters/settings_local.py

    # Install the required libraries
    $ pip install -r src/requirements.txt

    # Create the dev database
    $ python src/site/manage.py syncdb

    # Run the development server
    $ python src/site/manage.py runserver

> Note: When the Python virtualenv is activated, you'll see your shell prompt
> change to include a prefix like `(django-pdxroasters)shin:src tristanw$`.
> You can deactivate the virtualenv by typing `deactivate`.

You should now be able to access the site in your browser by visiting
`http://localhost:8000/` and the admin page by visiting `http://localhost:8000/admin/`.

When anybody modifies the data models, you'll need to delete the `pdxroasters.db` and run `python manage.py syncdb`. 

### UI Requirements and versions:
	
	Compass v0.12.2
	Grunt v0.3.17
	Ender v1.0.2
	Node v0.10.6
	npm v1.2.18
	

### UI Getting Started:
	
	$ cd site/static/js
	$ npm install grunt@0.3.17 (only if using grunt -v 4 and grunt-cli)
	$ npm install grunt-compass
	
	$ cd site/static/js/ender
	$ ender build clah bonzo ender-tween bean domready reqwest qwery jqwendery
	
	$ cd site/static/js
	$ grunt build
	$ grunt watch_all

### Pushing UI Files

When pushing to the dev site and ultimately to prod we'll need to manually push files compiled by grunt and compass:

    /static/css/*
    /static/js/dist/*

### Deploying to Heroku

To deploy the production site you need to first generate the compressed static
resources. Start by switching to the release branch:

    $ git checkout release
    $ git merge master

Then compile the necessary resources:

    $ cd site/pdxroasters/static/js
    $ grunt deploy

Finally check-in the updated files and push to heroku:

    $ git add -u .
    $ git commit -m "Updated resources."
    $ git push heroku release:master

> Note: heroku pg:reset DATABASE

### License

Source released under the BSD 2-Clause License. See LICENSE.
