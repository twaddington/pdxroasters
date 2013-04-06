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

### Compass

Reference: `http://compass-style.org/install`
CSS files compiled by Compass will be ignored by git

    # Navigate to static directory from src
    $ cd site/pdxroasters/static
    
    # Tell Compass to poll for changes
    $ compass watch
    
### Ender

Reference: `http://ender.jit.su`
All Ender files will be ignored by git other than custom packages

    # Navigate to ender directory from src
    $ cd site/pdxroasters/static/js/ender
    
    # View Ender status
    $ ender info
    
    # This projects current Ender Build
    $ ender build bean qwery clah jqwendery bonzo reqwest ender-tween domready mustache
    
### Grunt

Reference: `http://gruntjs.com`
Grunt's dist files will be ingored by git
    
    # Navigate to js directory
    $ cd site/pdxroasters/static/js
    
    # Tell Grunt to poll for changes
    $ grunt watch

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
