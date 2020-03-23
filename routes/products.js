app.post("/campgrounds", function(req, res){
	
	// get data from form and to campgrounds array
	
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	
	var newCampground = {
		name: name,
		image: image,
		description: description,
	};
	
	Campground.create(newCampground, function(err,newlyCreated){
		if(err){
			console.log(err)
		}else{
			console.log('Added a new campground');
		    res.redirect("/campgrounds");

		}
	})
	
})
	

	
	
	
	
app.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}
		else{
				res.render("campgrounds/show",{campground:foundCampground});
		}
	})

})


app.get("/campgrounds/:id/comments/new",isLoggedIn, function(req, res){
	
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new",{campground: foundCampground})
		}
	})
	
})


app.post("/campgrounds/:id/comments",isLoggedIn, function(req, res){
	
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log("something went wrong");
			res.redirect("/campgrounds");
		}
		else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log("break down")
				}
				else{
					foundCampground.comments.push(comment);
					foundCampground.save();
					res.redirect("/campgrounds/" + foundCampground._id);
				}
			})
		}
	})
	
})

