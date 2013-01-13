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
    $ cp src/pdxroasters/pdxroasters/settings_local.py.sample src/pdxroasters/pdxroasters/settings_local.py

    # Install the required libraries
    $ pip install -r src/requirements.txt

    # Create the dev database
    $ python src/pdxroasters/manage.py syncdb

    # Run the development server
    $ python src/pdxroasters/manage.py runserver

> Note: When the Python virtualenv is activated, you'll see your shell prompt
> change to include a prefix like `(django-pdxroasters)shin:src tristanw$`.
> You can deactivate the virtualenv by typing `deactivate`.

You should now be able to access the site in your browser by visiting
`http://localhost:8000/` and the admin page by visiting `http://localhost:8000/admin/`.

## Features

...

- Submit a roaster
- Contact

## Models

### Roaster

- Name
- Address
- lat/lng (geocoded)
- Hours (Mon-Fri: Open/Close, Sat: Open/Close, Sun: Open/Close)
- Phone
- Description
- URL
- Photo URL
- Video URL
- Roasts
- Cafes

### Roast

- Name
- Roaster

### Cafe

- Name
- Address
- lat/lng (geocoded)
- Hours
- Phone
- URL
- Roasters

## UI

...

### Compass

Reference: `http://compass-style.org/install`
CSS files compiled by Compass will be ignored by git

    # Navigate to static directory from src
    $ cd pdxroasters/pdxroasters/static
    
    # Tell Compass to poll for changes
    $ compass watch
    
### Ender

Reference: `http://ender.jit.su`
All Ender files will be ignored by git other than custom packages

    # Navigate to ender directory from src
    $ cd pdxroasters/pdxroasters/static/js/ender
    
    # View Ender status
    $ ender info
    
    # This projects current Ender Build
    $ ender build reqwest ender-tween bean domready qwery bonzo ./jqwendery/
    
### Grunt

Reference: `http://gruntjs.com`
Grunt's dist files will be ingored by git
    
    # Navigate to js directory
    $ cd pdxroasters/pdxroasters/static/js
    
    # Tell Grunt to poll for changes
    $ grunt watch

### Pushing UI Files

When pushing to the dev site and ultimately to prod we'll need to manually push files compiled by grunt and compass:
`/static/css/*`
`/static/js/dist/*`