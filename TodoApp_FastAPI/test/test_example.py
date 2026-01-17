import pytest
def test_equal_or_not_equal():
    assert 3==3

def test_is_instance():
    assert isinstance('this is a string',str)
    assert not isinstance('10',int)

def test_boolean():
    validate=True
    assert validate is True
    assert ('hello'=='world') is False

def test_type():
    assert type('Hello' is str)
    assert type('World' is not int)

def test_greater_and_less_than():
    assert 7>3
    assert 3<9

def test_list():
    num_list=[2,5,4,7,3]
    any_list=[False, False]
    assert 5 in num_list
    assert 6 not in num_list
    assert all(num_list)
    assert not any(any_list)

class Student:
    def __init__(self, first_name:str, last_name:str, major:str,years:int):
        self.first_name=first_name
        self.last_name=last_name
        self.major=major
        self.years=years

# Old way
# def test_student_initialiation():
#     p=Student('Titan',"Upadhya",'Comp Sci',3)
#     assert p.first_name=="Titan",'First name to be Titan'
#     assert p.last_name=="Upadhya",'last name to be Upadhya'
#     assert p.major=="Comp Sci",'Major should be Comp Sci'
#     assert p.years==3,'years to be 3'

@pytest.fixture
def default_student():
    return Student('Titan',"Upadhya",'Comp Sci',3)

def test_student_initialiation(default_student):
    assert default_student.first_name=="Titan",'First name to be Titan'
    assert default_student.last_name=="Upadhya",'last name to be Upadhya'
    assert default_student.major=="Comp Sci",'Major should be Comp Sci'
    assert default_student.years==3,'years to be 3'